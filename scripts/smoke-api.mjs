// Read-only. Never logs returned member data, tokens, media tickets or backend credentials.
const origin = process.env.LONGJU_API_ORIGIN || 'http://127.0.0.1:8081';
for (const path of [
  '/dictionaries/regions?parentCode=620000',
  '/dictionaries/regions?parentCode=610100',
  '/dictionaries/industries',
  '/announcements',
  '/activities',
  '/me',
  '/members',
]) {
  const response = await fetch(origin + '/api/v1/app' + path, {
    signal: AbortSignal.timeout(5000),
  });
  const body = await response.json();
  console.log(
    JSON.stringify({
      path,
      status: response.status,
      items: Array.isArray(body.data) ? body.data.length : body.data?.items?.length,
      error: body.error?.code,
    }),
  );
  if (path === '/me' || path === '/members' ? response.status !== 401 : response.status !== 200)
    process.exitCode = 1;
}
