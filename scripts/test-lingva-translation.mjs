#!/usr/bin/env node

const LINGVA_INSTANCES = [
  'https://translate.igna.wtf',
  'https://translate.plausibility.cloud',
  'https://lingva.lunar.icu',
  'https://translate.projectsegfau.lt',
];

function normalize(baseUrl) {
  return baseUrl.replace(/\/+$/, '');
}

function buildUrl(baseUrl, source, target, text) {
  return `${normalize(baseUrl)}/api/v1/${source}/${target}/${encodeURIComponent(text)}`;
}

async function callLingva({ baseUrl, source, target, text, timeoutMs }) {
  const url = buildUrl(baseUrl, source, target, text);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    const durationMs = Date.now() - startedAt;
    const body = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      durationMs,
      url,
      instance: normalize(baseUrl),
      body,
      headers: {
        contentType: response.headers.get('content-type'),
      },
    };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const text = process.argv[2] || 'Welcome to CholoBD. Discover amazing places in Bangladesh.';
  const source = process.argv[3] || 'en';
  const target = process.argv[4] || 'bn';
  const timeoutMs = Number(process.env.LINGVA_TIMEOUT_MS || 12000);

  console.log(
    JSON.stringify(
      {
        phase: 'request_config',
        text,
        source,
        target,
        timeoutMs,
        instances: LINGVA_INSTANCES,
      },
      null,
      2
    )
  );

  let lastFailure = null;

  for (const instance of LINGVA_INSTANCES) {
    try {
      const result = await callLingva({ baseUrl: instance, source, target, text, timeoutMs });

      if (result.ok && result.body && typeof result.body.translation === 'string') {
        console.log(JSON.stringify({ phase: 'success', result }, null, 2));

        const backendSample = {
          id: 'tour_101',
          title: 'Sunset River Cruise',
          description: 'Enjoy a peaceful cruise with live music and local snacks.',
          city: 'Dhaka',
          price: 1200,
        };

        const translatedPayload = { ...backendSample };
        for (const field of ['title', 'description']) {
          const translationResult = await callLingva({
            baseUrl: result.instance,
            source,
            target,
            text: backendSample[field],
            timeoutMs,
          });

          if (translationResult.ok && translationResult.body?.translation) {
            translatedPayload[field] = translationResult.body.translation;
          }
        }

        console.log(
          JSON.stringify(
            {
              phase: 'backend_payload_demo',
              original: backendSample,
              translated: translatedPayload,
            },
            null,
            2
          )
        );
        return;
      }

      lastFailure = {
        phase: 'non_success_response',
        result,
      };
      console.error(JSON.stringify(lastFailure, null, 2));
    } catch (error) {
      lastFailure = {
        phase: 'request_error',
        instance,
        error: error instanceof Error ? error.message : String(error),
      };
      console.error(JSON.stringify(lastFailure, null, 2));
    }
  }

  process.exitCode = 1;
  console.error(
    JSON.stringify(
      {
        phase: 'failed',
        message: 'No Lingva instance returned a valid translation response.',
        lastFailure,
      },
      null,
      2
    )
  );
}

main();
