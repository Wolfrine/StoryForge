import test from 'node:test';
import assert from 'node:assert/strict';
import {assertViewIdentity, reviewFailures, saveReviewReport} from './visual-review-evidence.mjs';

const sha = 'a'.repeat(40);
const viewport = {width:390, height:844};
function validReport() {
  return {
    expectedReleaseSha:sha, releaseBefore:sha, releaseAfter:sha, worldId:'novasaga',
    expectedViews:[{id:'lucas', viewport}],
    views:[{id:'lucas', viewport, state:{kind:'package', packageId:'lucas', worldId:'novasaga', contentSource:'firestore'}, screenshot:'390-lucas.png', overflow:false, brokenImages:[], errors:[]}]
  };
}

test('an actual package state passes technical verification without claiming design acceptance', async () => {
  const report=validReport(); let saved;
  await saveReviewReport(report, async (_path, body) => {saved=JSON.parse(body);});
  assert.equal(saved.verification,'passed');
  assert.equal(saved.designAcceptance,'not-assessed');
});
test('landing page with a valid h1 cannot substitute for requested package', () => {
  assert.throws(() => assertViewIdentity({packageId:'lucas',worldId:'novasaga'}, {kind:'landing',worldId:'novasaga',contentSource:'firestore',title:'NovaSaga'}), /Wrong rendered state/);
});
test('a different package or offline fallback cannot pass as the requested live package', () => {
  const state=validReport().views[0].state;
  assert.throws(() => assertViewIdentity({packageId:'cessation',worldId:'novasaga'},state), /Wrong rendered state/);
  assert.throws(() => assertViewIdentity({packageId:'lucas',worldId:'novasaga'},{...state,contentSource:'snapshot'}), /Wrong rendered state/);
});
test('landing is accepted only when landing itself was requested', () => {
  assert.doesNotThrow(() => assertViewIdentity({packageId:'',worldId:'novasaga'}, {kind:'landing',worldId:'novasaga',contentSource:'firestore'}));
});
for (const [name, mutate] of [
  ['overflow', r => {r.views[0].overflow=true;}],
  ['broken image', r => {r.views[0].brokenImages=['broken.webp'];}],
  ['uncaught browser error', r => {r.views[0].errors=['TypeError: render failed'];}],
  ['missing capture', r => {delete r.views[0].screenshot;}],
  ['missing viewport', r => {r.views=[];}],
  ['duplicate capture hiding a missing route', r => {r.expectedViews.push({id:'cessation',viewport});r.views.push(structuredClone(r.views[0]));}],
  ['newer release during review', r => {r.releaseAfter='b'.repeat(40);}],
  ['unverified release', r => {delete r.releaseBefore;}]
]) {
  test(`${name} fails instead of reporting green`, () => {const report=validReport();mutate(report);assert(reviewFailures(report).length>0);});
}
test('failure report is saved before the verifier rejects the run', async () => {
  const report=validReport();report.views[0].state.kind='landing';let saved;
  await assert.rejects(saveReviewReport(report, async (path,body) => {saved={path,body:JSON.parse(body)};}), /Technical visual verification failed/);
  assert.equal(saved.path,'review/report.json');
  assert.equal(saved.body.verification,'failed');
  assert.equal(saved.body.views[0].screenshot,'390-lucas.png');
});
