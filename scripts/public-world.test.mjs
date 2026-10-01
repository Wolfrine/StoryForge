import test from 'node:test';
import assert from 'node:assert/strict';
import {loadPublicWorld, decodeFirestoreValue} from '../src/content/public-world.ts';

const fallback = {schemaVersion:'1.0',id:'fixture',title:'Fixture',theme:{},packages:[]};
const value = data => data === null ? {nullValue:null} : Array.isArray(data) ? {arrayValue:{values:data.map(value)}} : typeof data === 'object' ? {mapValue:{fields:Object.fromEntries(Object.entries(data).map(([k,v])=>[k,value(v)]))}} : typeof data === 'boolean' ? {booleanValue:data} : typeof data === 'number' ? {doubleValue:data} : {stringValue:data};
const document = data => ({fields:value(data).mapValue.fields});
const world = document({id:'novasaga',title:'Published world',_meta:{privateSystemMarker:'discard'},entryPolicy:{maxDirections:5}});
const pkg = id => document({schemaVersion:'1.0',id,title:id,kind:'concept',blocks:[],_meta:{revision:'discard'}});
const response = (data,status=200) => new Response(JSON.stringify(data), {status,headers:{'content-type':'application/json'}});
function fixture(overrides={}) {
  const calls=[];
  const fetcher=async (url,options) => {
    calls.push({url,options});
    if (overrides.fetch) {const result=await overrides.fetch(url,options,calls);if(result)return result;}
    if(url==='/__/firebase/init.json')return response({projectId:'lumio-forge'});
    if(url.includes('/packages?'))return response({documents:[pkg('one')]});
    return response(world);
  };
  return {calls,fetcher};
}
const load = (fetcher,extra={}) => loadPublicWorld({worldId:'novasaga',fallback,fetcher,...extra});

test('reads only public Hosting configuration and published Firestore documents, preserving live data', async () => {
  const {fetcher,calls}=fixture();const result=await load(fetcher);
  assert.equal(result.id,'novasaga');assert.equal(result.title,'Published world');assert.equal(result.packages[0].id,'one');
  assert(!('_meta' in result));assert(!('_meta' in result.packages[0]));
  assert.equal(calls.length,3);
  for(const {url,options} of calls){assert(url==='/__/firebase/init.json'||url.startsWith('https://firestore.googleapis.com/v1/projects/lumio-forge/databases/(default)/documents/storyworlds/novasaga'));assert.equal(options.method,undefined);assert.equal(options.headers.Authorization,undefined);}
});
test('decodes nested values and keeps false, zero, empty arrays and null', () => {
  assert.deepEqual(decodeFirestoreValue({mapValue:{fields:{count:{integerValue:'0'},enabled:{booleanValue:false},items:{arrayValue:{}},empty:{nullValue:null}}}}),{count:0,enabled:false,items:[],empty:null});
});
test('reads subsequent pages and filters unsupported package versions', async () => {
  const {fetcher,calls}=fixture({fetch:async url => url.includes('pageToken=next%2Fpage') ? response({documents:[pkg('two'),document({schemaVersion:'2.0',id:'unsupported'})]}) : url.includes('/packages?') ? response({documents:[pkg('one')],nextPageToken:'next/page'}) : undefined});
  const result=await load(fetcher);assert.deepEqual(result.packages.map(p=>p.id),['one','two']);assert.equal(calls.length,4);
});
test('a live read taking longer than the old 2.6s race remains eligible to succeed', async () => {
  const {fetcher}=fixture({fetch:async url => {if(url.endsWith('/novasaga')){await new Promise(resolve=>setTimeout(resolve,2700));return response(world);}}});
  assert.equal((await load(fetcher,{timeoutMs:5000})).id,'novasaga');
});
test('retries a transient HTTP failure exactly once', async () => {
  let attempts=0;const {fetcher}=fixture({fetch:async url => {if(url==='/__/firebase/init.json'&&++attempts===1)return response({},503);}});
  assert.equal((await load(fetcher)).id,'novasaga');assert.equal(attempts,2);
});
test('retries a network failure once but does not loop indefinitely', async () => {
  let attempts=0;const {fetcher}=fixture({fetch:async () => {attempts++;throw new TypeError('network failure');}});
  await assert.rejects(load(fetcher),/network failure/);assert.equal(attempts,2);
});
test('permission failures are not retried or relaxed', async () => {
  const {fetcher,calls}=fixture({fetch:async ()=>response({},403)});
  await assert.rejects(load(fetcher),/403/);assert.equal(calls.length,1);
});
test('deadline aborts an outstanding request instead of leaving a background read', async () => {
  let aborted=false;
  const fetcher=(_url,{signal})=>new Promise((_resolve,reject)=>signal.addEventListener('abort',()=>{aborted=true;reject(signal.reason);},{once:true}));
  await assert.rejects(load(fetcher,{timeoutMs:10}),/deadline/);assert.equal(aborted,true);
});
test('caller cancellation propagates and does not create another request', async () => {
  const controller=new AbortController();controller.abort(new Error('unmounted'));const {fetcher,calls}=fixture();
  await assert.rejects(load(fetcher,{signal:controller.signal}),/unmounted/);assert.equal(calls.length,0);
});
test('cancellation aborts in-flight loading', async () => {
  const controller=new AbortController();let started;
  const entered=new Promise(resolve=>{started=resolve;});
  const fetcher=(_url,{signal})=>new Promise((_resolve,reject)=>{started();signal.addEventListener('abort',()=>reject(signal.reason),{once:true});});
  const result=load(fetcher,{signal:controller.signal});await entered;controller.abort(new Error('unmounted'));
  await assert.rejects(result,/unmounted/);
});
test('missing configuration and empty supported content are explicit failures', async () => {
  const noConfig=fixture({fetch:async url=>url==='/__/firebase/init.json'?response({}):undefined});
  await assert.rejects(load(noConfig.fetcher),/project ID/);
  const empty=fixture({fetch:async url=>url.includes('/packages?')?response({documents:[]}):undefined});
  await assert.rejects(load(empty.fetcher),/no supported packages/);
});
test('repeated pagination tokens terminate rather than returning partial live content', async () => {
  const {fetcher}=fixture({fetch:async url=>url.includes('/packages?')?response({documents:[pkg('one')],nextPageToken:'repeated'}):undefined});
  await assert.rejects(load(fetcher),/repeated/);
});
