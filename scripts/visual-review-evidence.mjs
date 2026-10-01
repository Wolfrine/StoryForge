// Technical evidence integrity only; this does not assess aesthetic quality.
export function assertViewIdentity(expected, observed) {
  const kind = expected.packageId ? 'package' : 'landing';
  if (!observed || observed.kind !== kind || observed.worldId !== expected.worldId ||
      (kind === 'package' && observed.packageId !== expected.packageId) ||
      observed.contentSource !== 'firestore') {
    throw new Error(`Wrong rendered state: expected ${JSON.stringify({...expected, kind, contentSource: 'firestore'})}; observed ${JSON.stringify(observed)}`);
  }
}

export function reviewFailures(report) {
  const failures = [];
  if (!/^[a-f0-9]{40}$/.test(report.expectedReleaseSha || '') ||
      report.releaseBefore !== report.expectedReleaseSha ||
      report.releaseAfter !== report.expectedReleaseSha) {
    failures.push('The live release does not match the deployment under review throughout capture.');
  }
  if (!Array.isArray(report.expectedViews) || !report.expectedViews.length) {
    failures.push('No expected views were declared.');
  }
  const views = Array.isArray(report.views) ? report.views : [];
  const key = row => JSON.stringify([row.id || '', row.viewport?.width, row.viewport?.height]);
  for (const expected of report.expectedViews || []) {
    const matches = views.filter(view => key(view) === key(expected));
    if (matches.length !== 1) {
      failures.push(`${key(expected)}: expected exactly one captured view, found ${matches.length}.`);
    }
  }
  if (views.length !== (report.expectedViews || []).length) failures.push('Captured view count differs from the declared review scope.');
  for (const view of views) {
    const label = key(view);
    try { assertViewIdentity({packageId: view.id, worldId: report.worldId}, view.state); }
    catch (error) { failures.push(`${label}: ${error.message}`); }
    if (!view.screenshot) failures.push(`${label}: screenshot missing.`);
    if (view.overflow !== false) failures.push(`${label}: overflow detected or measurement missing.`);
    if (!Array.isArray(view.brokenImages) || view.brokenImages.length) failures.push(`${label}: broken images detected or measurement missing.`);
    if (!Array.isArray(view.errors) || view.errors.length) failures.push(`${label}: browser or inspection errors: ${JSON.stringify(view.errors)}.`);
  }
  return failures;
}

export async function saveReviewReport(report, writeFile) {
  report.failures = reviewFailures(report);
  report.verification = report.failures.length ? 'failed' : 'passed';
  report.designAcceptance = 'not-assessed';
  await writeFile('review/report.json', JSON.stringify(report, null, 2) + '\n');
  if (report.failures.length) throw new Error(`Technical visual verification failed:\n${report.failures.join('\n')}`);
}
