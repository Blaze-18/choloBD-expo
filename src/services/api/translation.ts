const DEFAULT_LINGVA_INSTANCES = [
  'https://translate.igna.wtf',
  'https://translate.plausibility.cloud',
  'https://lingva.lunar.icu',
  'https://translate.projectsegfau.lt',
];

export type LingvaInfo = {
  pronunciation?: {
    query?: string;
    translation?: string;
  };
  definitions?: unknown;
  examples?: unknown;
  synonyms?: unknown;
};

export type LingvaSuccessResponse = {
  translation: string;
  info?: LingvaInfo;
};

export type LingvaErrorResponse = {
  error: string;
};

export type TranslateTextOptions = {
  source?: string;
  target?: string;
  instances?: string[];
  timeoutMs?: number;
};

export type TranslateTextResult = {
  translatedText: string;
  instanceUsed: string;
  source: string;
  target: string;
  raw: LingvaSuccessResponse;
};

function normalizeInstances(instances?: string[]): string[] {
  const selected = instances && instances.length ? instances : DEFAULT_LINGVA_INSTANCES;
  return selected.map((item) => item.replace(/\/+$/, ''));
}

function buildEndpoint(instance: string, source: string, target: string, text: string): string {
  const encoded = encodeURIComponent(text);
  return `${instance}/api/v1/${source}/${target}/${encoded}`;
}

function withTimeout(timeoutMs: number): AbortController {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller;
}

export async function translateTextWithLingva(
  text: string,
  options: TranslateTextOptions = {}
): Promise<TranslateTextResult> {
  if (!text || !text.trim()) {
    throw new Error('translateTextWithLingva requires non-empty text');
  }

  const source = options.source ?? 'auto';
  const target = options.target ?? 'bn';
  const timeoutMs = options.timeoutMs ?? 10000;
  const instances = normalizeInstances(options.instances);

  let lastError: string | null = null;

  for (const instance of instances) {
    const controller = withTimeout(timeoutMs);
    const url = buildEndpoint(instance, source, target, text);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      const body = (await response.json()) as LingvaSuccessResponse | LingvaErrorResponse;

      if (!response.ok) {
        const errorMsg = 'error' in body ? body.error : `HTTP ${response.status}`;
        lastError = `${instance}: ${errorMsg}`;
        continue;
      }

      if (!('translation' in body) || !body.translation) {
        lastError = `${instance}: invalid Lingva response`;
        continue;
      }

      return {
        translatedText: body.translation,
        instanceUsed: instance,
        source,
        target,
        raw: body,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown translation error';
      lastError = `${instance}: ${message}`;
    }
  }

  throw new Error(lastError ?? 'No Lingva instance could complete the request');
}

export async function translateArrayFields<T extends Record<string, unknown>>(
  items: T[],
  fields: Array<keyof T>,
  options: TranslateTextOptions = {}
): Promise<T[]> {
  const output: T[] = [];

  for (const item of items) {
    const translated = { ...item };

    for (const field of fields) {
      const value = translated[field];
      if (typeof value === 'string' && value.trim()) {
        const result = await translateTextWithLingva(value, options);
        translated[field] = result.translatedText as T[keyof T];
      }
    }

    output.push(translated);
  }

  return output;
}

function normalizeLanguageCode(language: string): string {
  return language.trim().toLowerCase().split('-')[0];
}

export async function translateDescriptionIfNeeded(
  description: string | null | undefined,
  currentLanguage: string,
  options: TranslateTextOptions = {}
): Promise<string> {
  if (!description || !description.trim()) {
    return description ?? '';
  }

  const target = normalizeLanguageCode(options.target ?? currentLanguage ?? 'en');
  if (target === 'en') {
    return description;
  }

  try {
    const startedAt = Date.now();
    const result = await translateTextWithLingva(description, {
      ...options,
      source: options.source ?? 'en',
      target,
    });

    if (__DEV__) {
      console.log('[translation] description translated', {
        target,
        instance: result.instanceUsed,
        durationMs: Date.now() - startedAt,
      });
    }

    return result.translatedText;
  } catch (error: unknown) {
    if (__DEV__) {
      const message = error instanceof Error ? error.message : 'Unknown translation failure';
      console.warn('[translation] description translation failed, using original', {
        target,
        message,
      });
    }

    return description;
  }
}

export async function translateDisplayStringListIfNeeded(
  values: Array<string | null | undefined> | null | undefined,
  currentLanguage: string,
  options: TranslateTextOptions = {}
): Promise<string[]> {
  if (!values || values.length === 0) {
    return [];
  }

  const target = normalizeLanguageCode(options.target ?? currentLanguage ?? 'en');
  const sanitized = values
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);

  if (sanitized.length === 0 || target === 'en') {
    return sanitized;
  }

  const translated = await Promise.all(
    sanitized.map(async (item) => {
      try {
        const result = await translateTextWithLingva(item, {
          ...options,
          source: options.source ?? 'en',
          target,
        });
        return result.translatedText;
      } catch {
        return item;
      }
    })
  );

  if (__DEV__) {
    console.log('[translation] display string list translated', {
      target,
      total: sanitized.length,
    });
  }

  return translated;
}
