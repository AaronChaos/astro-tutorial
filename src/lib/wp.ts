/**
 * WordPress REST client.
 *
 * Talks to the headless PhantomWP backend exposed by the
 * astro-headless mu-plugin (see wp-content/novamira-sandbox/astro-headless.php).
 *
 * Single env var: PUBLIC_WP_URL. Falls back to the staging install so the
 * project still builds when no env is set.
 */

const WP_URL =
  import.meta.env.PUBLIC_WP_URL?.replace(/\/$/, '') ||
  'https://discountsolar.co.uk';

// Per-process in-memory cache. Lives for the duration of a single
// `astro build` or dev request — perfect for build-time fetching, no Redis needed.
const cache = new Map<string, unknown>();

async function wpFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${WP_URL}/wp-json${path}`;
  const cacheKey = `${init?.method ?? 'GET'} ${url}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey) as T;
  }

  const res = await fetch(url, {
    ...init,
    headers: { Accept: 'application/json', ...(init?.headers ?? {}) },
  });

  if (!res.ok) {
    throw new Error(`WP fetch failed: ${res.status} ${res.statusText} — ${url}`);
  }

  const data = (await res.json()) as T;
  cache.set(cacheKey, data);
  return data;
}

// ---------- Types ----------

export interface WpImage {
  id: number;
  url: string;
  width: number;
  height: number;
  alt: string;
}

export interface WpPostBase {
  id: number;
  slug: string;
  title: { rendered: string };
  status: string;
  acf: Record<string, unknown>;
  meta_compact: Record<string, string>;
  featured_image: WpImage | null;
  permalink: string;
}

export interface Niche extends WpPostBase {}
export interface Location extends WpPostBase {}

export interface AcfButton {
  hero_alpha_cta_button_text: string;
  hero_alpha_button_url: string;
}

export interface HeroAlphaSection {
  acf_fc_layout: 'hero_alpha';
  hero_alpha_background_image?: number | WpImage | null;
  hero_alpha_heading: string;
  hero_alpha_introduction: string;
  hero_alpha_show_cta_section: boolean;
  hero_alpha_cta_heading?: string;
  hero_alpha_cta_introduction?: string;
  hero_alpha_cta_buttons?: AcfButton[];
}

export interface ContentAlphaButton {
  content_alpha_button_text: string;
  content_alpha_button_url: string;
}

export interface ContentAlphaSection {
  acf_fc_layout: 'content_alpha';
  content_alpha_background_colour?: string | AcfColor;
  content_alpha_heading?: string;
  content_alpha_introduction?: string;
  content_alpha_main_content?: string;
  content_alpha_image?: number | WpImage | null;
  content_alpha_cta_buttons?: ContentAlphaButton[];
}

export interface CtaAlphaButton { cta_alpha_button_text: string; cta_alpha_button_url: string; }
export interface CtaAlphaSection {
  acf_fc_layout: 'cta_alpha';
  cta_alpha_heading?: string;
  cta_alpha_introduction?: string;
  cta_alpha_cta_buttons?: CtaAlphaButton[];
  cta_alpha_image?: number | WpImage | null;
}

export interface FaqAlphaItem { faq_alpha_faq_question: string; faq_alpha_faq_answer: string; }
export interface FaqAlphaSection {
  acf_fc_layout: 'faq_alpha';
  faq_alpha_background_colour?: string | AcfColor;
  faq_alpha_heading?: string;
  faq_alpha_introduction?: string;
  faq_alpha_qanda?: FaqAlphaItem[];
}

export interface FeatureAlphaBlock {
  feature_alpha_image?: number | WpImage | null;
  feature_alpha_heading?: string;
  feature_alpha_main_content?: string;
  feature_alpha_button_text?: string;
  feature_alpha_button_url?: string;
}
export interface FeatureAlphaSection {
  acf_fc_layout: 'feature_alpha';
  feature_alpha_background_colour?: string | AcfColor;
  feature_alpha_container_background_colour?: string | AcfColor;
  feature_alpha_block?: FeatureAlphaBlock[];
}

export interface ProcessAlphaStep { process_alpha_steps_subheading?: string; process_alpha_steps_content?: string; }
export interface ProcessAlphaSection {
  acf_fc_layout: 'process_alpha';
  process_alpha_background_colour?: string | AcfColor;
  process_alpha_container_background_colour?: string | AcfColor;
  process_alpha_heading?: string;
  process_alpha_introduction?: string;
  process_alpha_steps?: ProcessAlphaStep[];
}

export interface MembersGridSection {
  acf_fc_layout: 'members_grid';
  members_grid_background_colour?: string | AcfColor;
  members_grid_heading?: string;
  members_grid_introduction?: string;
  members_grid_use_defaults?: boolean;
  members_grid_display_mode?: string;
  members_grid_grid_style?: string;
  members_grid_member_types?: string[];
  members_grid_age_range?: { members_grid_minimum_age?: number; members_grid_maximum_age?: number };
  members_grid_location?: { members_grid_country?: string; members_grid_region?: string; members_grid_city?: string };
  members_grid_results?: number;
  members_grid_image_size?: number;
}

// ---------- Page Title variants ----------
interface PageTitleBase { acf_fc_layout: string; }
export interface PageTitleAlphaSection extends PageTitleBase { acf_fc_layout: 'page_title_alpha'; page_title_alpha_heading?: string; page_title_alpha_breadcrumbs?: boolean; }
export interface PageTitleBetaSection extends PageTitleBase { acf_fc_layout: 'page_title_beta'; page_title_beta_heading?: string; page_title_beta_breadcrumbs?: boolean; }
export interface PageTitleCharlieSection extends PageTitleBase { acf_fc_layout: 'page_title_charlie'; page_title_charlie_heading?: string; page_title_charlie_breadcrumbs?: boolean; page_title_charlie_background_image?: number | WpImage | null; }
export interface PageTitleDeltaSection extends PageTitleBase { acf_fc_layout: 'page_title_delta'; page_title_delta_heading?: string; page_title_delta_breadcrumbs?: boolean; }

// ---------- Hero variants ----------
export interface HeroBetaButton { hero_beta_cta_button_text?: string; hero_beta_button_url?: string; }
export interface HeroBetaSection { acf_fc_layout: 'hero_beta'; hero_beta_background_image?: number | WpImage | null; hero_beta_heading?: string; hero_beta_introduction?: string; hero_beta_show_cta_section?: boolean; hero_beta_cta_heading?: string; hero_beta_cta_introduction?: string; hero_beta_cta_buttons?: HeroBetaButton[]; }
export interface HeroCharlieButton { hero_charlie_button_text?: string; hero_charlie_button_url?: string; }
export interface HeroCharlieSection { acf_fc_layout: 'hero_charlie'; hero_charlie_background_colour?: string | AcfColor; hero_charlie_image_one?: number | WpImage | null; hero_charlie_image_two?: number | WpImage | null; hero_charlie_image_three?: number | WpImage | null; hero_charlie_heading?: string; hero_charlie_introduction?: string; hero_charlie_cta_buttons?: HeroCharlieButton[]; }
export interface HeroDeltaButton { hero_delta_button_text?: string; hero_delta_button_url?: string; }
export interface HeroDeltaSection { acf_fc_layout: 'hero_delta'; hero_delta_background_colour?: string | AcfColor; hero_delta_heading?: string; hero_delta_introduction?: string; hero_delta_cta_buttons?: HeroDeltaButton[]; hero_delta_image_one?: number | WpImage | null; hero_delta_image_two?: number | WpImage | null; hero_delta_image_three?: number | WpImage | null; hero_delta_image_four?: number | WpImage | null; hero_delta_image_five?: number | WpImage | null; hero_delta_image_six?: number | WpImage | null; hero_delta_image_seven?: number | WpImage | null; hero_delta_image_eight?: number | WpImage | null; hero_delta_image_nine?: number | WpImage | null; }
export interface HeroEchoButton { hero_echo_button_text?: string; hero_echo_button_url?: string; }
export interface HeroEchoSection { acf_fc_layout: 'hero_echo'; hero_echo_background_colour?: string | AcfColor; hero_echo_image_one?: number | WpImage | null; hero_echo_image_two?: number | WpImage | null; hero_echo_heading?: string; hero_echo_introduction?: string; hero_echo_cta_buttons?: HeroEchoButton[]; }

// ---------- Content variants ----------
export interface ContentBetaButton { content_beta_button_text?: string; content_beta_button_url?: string; }
export interface ContentBetaSection { acf_fc_layout: 'content_beta'; content_beta_background_colour?: string | AcfColor; content_beta_heading?: string; content_beta_introduction?: string; content_beta_main_content?: string; content_beta_cta_buttons?: ContentBetaButton[]; content_beta_image?: number | WpImage | null; }
export interface ContentCharlieFeature { content_charlie_feature_subtitle?: string; content_charlie_feature_content?: string; content_charlie_counters?: Record<string, unknown>; }
export interface ContentCharlieSection { acf_fc_layout: 'content_charlie'; content_charlie_background_colour?: string | AcfColor; content_charlie_container_background_colour?: string | AcfColor; content_charlie_heading?: string; content_charlie_introduction?: string; content_charlie_show_feature_counters?: boolean; content_charlie_features?: ContentCharlieFeature[]; content_charlie_image?: number | WpImage | null; }
export interface ContentDeltaButton { content_delta_button_text?: string; content_delta_button_url?: string; }
export interface ContentDeltaSection { acf_fc_layout: 'content_delta'; content_delta_background_colour?: string | AcfColor; content_delta_heading?: string; content_delta_main_content?: string; content_delta_cta_buttons?: ContentDeltaButton[]; content_delta_image?: number | WpImage | null; content_delta_image_two?: number | WpImage | null; }
export interface ContentEchoButton { content_echo_button_text?: string; content_echo_button_url?: string; }
export interface ContentEchoSection { acf_fc_layout: 'content_echo'; content_echo_background_colour?: string | AcfColor; content_echo_heading?: string; content_echo_main_content?: string; content_echo_cta_buttons?: ContentEchoButton[]; content_echo_image?: number | WpImage | null; content_echo_image_two?: number | WpImage | null; }

// ---------- Process variants ----------
export interface ProcessBetaStep { process_beta_steps_subheading?: string; process_beta_steps_content?: string; }
export interface ProcessBetaSection { acf_fc_layout: 'process_beta'; process_beta_background_colour?: string | AcfColor; process_beta_heading?: string; process_beta_introduction?: string; process_beta_steps?: ProcessBetaStep[]; }
export interface ProcessCharlieStep { process_charlie_steps_subheading?: string; process_charlie_steps_content?: string; process_charlie_steps_background_image?: number | WpImage | null; }
export interface ProcessCharlieSection { acf_fc_layout: 'process_charlie'; process_charlie_background_colour?: string | AcfColor; process_charlie_heading?: string; process_charlie_introduction?: string; process_charlie_steps?: ProcessCharlieStep[]; }

// ---------- CTA variants ----------
export interface CtaBetaSection { acf_fc_layout: 'cta_beta'; cta_beta_background_colour?: string | AcfColor; cta_beta_heading?: string; cta_beta_introduction?: string; cta_beta_button_text?: string; cta_beta_button_url?: string; cta_beta_image?: number | WpImage | null; }
export interface CtaCharlieButton { cta_charlie_button_text?: string; cta_charlie_button_url?: string; }
export interface CtaCharlieSection { acf_fc_layout: 'cta_charlie'; cta_charlie_background_colour?: string | AcfColor; cta_charlie_container_background_colour?: string | AcfColor; cta_charlie_heading?: string; cta_charlie_introduction?: string; cta_charlie_cta_buttons?: CtaCharlieButton[]; cta_charlie_image_one?: number | WpImage | null; cta_charlie_image_two?: number | WpImage | null; cta_charlie_image_three?: number | WpImage | null; cta_charlie_image_four?: number | WpImage | null; cta_charlie_image_five?: number | WpImage | null; cta_charlie_image_six?: number | WpImage | null; cta_charlie_image_seven?: number | WpImage | null; cta_charlie_image_eight?: number | WpImage | null; }
export interface CtaDeltaButton { cta_delta_button_text?: string; cta_delta_button_url?: string; }
export interface CtaDeltaSection { acf_fc_layout: 'cta_delta'; cta_delta_background_colour?: string | AcfColor; cta_delta_container_background_colour?: string | AcfColor; cta_delta_heading?: string; cta_delta_introduction?: string; cta_delta_cta_buttons?: CtaDeltaButton[]; cta_delta_image?: number | WpImage | null; }
export interface CtaEchoButton { cta_echo_button_text?: string; cta_echo_button_url?: string; }
export interface CtaEchoSection { acf_fc_layout: 'cta_echo'; cta_echo_heading?: string; cta_echo_introduction?: string; cta_echo_cta_buttons?: CtaEchoButton[]; cta_echo_image?: number | WpImage | null; }
export interface CtaFoxtrotSection { acf_fc_layout: 'cta_foxtrot'; cta_foxtrot_background_colour?: string | AcfColor; cta_foxtrot_heading?: string; cta_foxtrot_introduction?: string; cta_foxtrot_button_text?: string; cta_foxtrot_button_url?: string; }
export interface CtaGolfSection { acf_fc_layout: 'cta_golf'; cta_golf_background_image?: number | WpImage | null; cta_golf_overlay_colour?: string | AcfColor; cta_golf_heading?: string; cta_golf_introduction?: string; cta_golf_button_text?: string; cta_golf_button_url?: string; }

// ---------- FAQ variants ----------
export interface FaqBetaItem { faq_beta_faq_question?: string; faq_beta_faq_answer?: string; }
export interface FaqBetaSection { acf_fc_layout: 'faq_beta'; faq_beta_background_colour?: string | AcfColor; faq_beta_container_background_colour?: string | AcfColor; faq_beta_heading?: string; faq_beta_introduction?: string; faq_beta_qanda?: FaqBetaItem[]; }

// ---------- Feature variants ----------
export interface FeatureBetaBlock { feature_beta_image?: number | WpImage | null; feature_beta_heading?: string; feature_beta_main_content?: string; feature_beta_button_text?: string; feature_beta_button_url?: string; }
export interface FeatureBetaSection { acf_fc_layout: 'feature_beta'; feature_beta_background_colour?: string | AcfColor; feature_beta_container_background_colour?: string | AcfColor; feature_beta_block?: FeatureBetaBlock[]; }
export interface FeatureCharlieBlock { feature_charlie_block_image?: number | WpImage | null; feature_charlie_block_heading?: string; feature_charlie_block_main_content?: string; }
export interface FeatureCharlieSection { acf_fc_layout: 'feature_charlie'; feature_charlie_background_colour?: string | AcfColor; feature_charlie_container_background_colour?: string | AcfColor; feature_charlie_heading?: string; feature_charlie_main_content?: string; feature_charlie_button_text?: string; feature_charlie_button_url?: string; feature_charlie_block?: FeatureCharlieBlock[]; }
export interface FeatureDeltaBlock { feature_delta_block_icon?: string; feature_delta_block_heading?: string; feature_delta_block_main_content?: string; }
export interface FeatureDeltaSection { acf_fc_layout: 'feature_delta'; feature_delta_background_colour?: string | AcfColor; feature_delta_container_background_colour?: string | AcfColor; feature_delta_card_background_colour?: string | AcfColor; feature_delta_heading?: string; feature_delta_introduction?: string; feature_delta_block?: FeatureDeltaBlock[]; }
export interface FeatureEchoBlock { feature_echo_block_icon?: string; feature_echo_block_heading?: string; feature_echo_block_main_content?: string; }
export interface FeatureEchoSection { acf_fc_layout: 'feature_echo'; feature_echo_background_colour?: string | AcfColor; feature_echo_card_background_colour?: string | AcfColor; feature_echo_heading?: string; feature_echo_introduction?: string; feature_echo_block?: FeatureEchoBlock[]; }

// ---------- Blog variants (use posts data fetched via wp.getPosts) ----------
export interface BlogArchiveAlphaSection { acf_fc_layout: 'blog_archive_alpha'; blog_alpha_heading?: string; blog_alpha_introduction?: string; }
export interface BlogArchiveBetaSection { acf_fc_layout: 'blog_archive_beta'; blog_beta_heading?: string; blog_beta_introduction?: string; }
export interface BlogArchiveCharlieSection { acf_fc_layout: 'blog_archive_charlie'; blog_charlie_heading?: string; blog_charlie_introduction?: string; }
export interface BlogFeedAlphaSection { acf_fc_layout: 'blog_feed_alpha'; blog_feed_alpha_background_colour?: string | AcfColor; blog_feed_alpha_heading?: string; blog_feed_introduction?: string; }
export interface BlogFeedBetaSection { acf_fc_layout: 'blog_feed_beta'; blog_feed_beta_background_colour?: string | AcfColor; blog_feed_beta_card_background_colour?: string | AcfColor; blog_feed_beta_heading?: string; blog_feed_beta_introduction?: string; }
export interface BlogFeedCharlieSection { acf_fc_layout: 'blog_feed_charlie'; blog_feed_charlie_background_colour?: string | AcfColor; blog_feed_charlie_card_background_colour?: string | AcfColor; blog_feed_charlie_heading?: string; blog_feed_charlie_introduction?: string; }

export interface WpPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  link: string;
  featured_image: WpImage | null;
}

export type Section =
  | HeroAlphaSection | HeroBetaSection | HeroCharlieSection | HeroDeltaSection | HeroEchoSection
  | PageTitleAlphaSection | PageTitleBetaSection | PageTitleCharlieSection | PageTitleDeltaSection
  | ContentAlphaSection | ContentBetaSection | ContentCharlieSection | ContentDeltaSection | ContentEchoSection
  | CtaAlphaSection | CtaBetaSection | CtaCharlieSection | CtaDeltaSection | CtaEchoSection | CtaFoxtrotSection | CtaGolfSection
  | FaqAlphaSection | FaqBetaSection
  | FeatureAlphaSection | FeatureBetaSection | FeatureCharlieSection | FeatureDeltaSection | FeatureEchoSection
  | ProcessAlphaSection | ProcessBetaSection | ProcessCharlieSection
  | BlogArchiveAlphaSection | BlogArchiveBetaSection | BlogArchiveCharlieSection
  | BlogFeedAlphaSection | BlogFeedBetaSection | BlogFeedCharlieSection
  | MembersGridSection
  | { acf_fc_layout: string; [k: string]: unknown };

export interface LandingPage {
  id: number;
  title: string;
  slug: string;
  permalink: string;
  location: { id: number; title: string; slug: string };
  niche: { id: number; title: string; slug: string };
  acf: { page_sections?: Section[] } & Record<string, unknown>;
}

/**
 * Some ACF fields store a nav menu as either a bare term_id (number or string)
 * or as the full WP term object. This type covers both shapes.
 */
export type MenuRef = number | string | { term_id: number; slug?: string; name?: string };

/** Spelled the same as ACF's color picker shape. */
export interface AcfColor { color: string; slug?: string; label?: string; rgba?: { red: number; green: number; blue: number; alpha: number } }

export interface SiteSettings {
  global_domain_name?: string;
  global_subdomain_name?: string;

  header_logo?: string;
  header_logo_size?: string;
  header_show_button?: boolean;
  header_button_text?: string;
  header_button_link?: string;
  header_background_colour?: AcfColor;
  header_menu_colour?: AcfColor;
  header_layout?: string;
  header_style?: string;

  mobile_menu_logo?: string;
  header_mobile_menu_colour?: AcfColor;

  footer_logo?: string;
  footer_columns?: 'one' | 'two' | 'three' | 'four' | 'five' | 'six' | string;
  footer_background_colour?: AcfColor;
  footer_text_colour?: AcfColor;
  footer_link_colour?: AcfColor;
  footer_copyright_text_colour?: AcfColor;

  // Up to six column heading/menu pairs — read dynamically.
  footer_column_one_heading?: string;
  footer_column_one_menu?: MenuRef;
  footer_column_two_heading?: string;
  footer_column_two_menu?: MenuRef;
  footer_column_three_heading?: string;
  footer_column_three_menu?: MenuRef;
  footer_column_four_heading?: string;
  footer_column_four_menu?: MenuRef;
  footer_column_five_heading?: string;
  footer_column_five_menu?: MenuRef;
  footer_column_six_heading?: string;
  footer_column_six_menu?: MenuRef;

  footer_legal_menu?: MenuRef;

  [k: string]: unknown;
}

export interface MenuItem {
  id: number;
  parent: number;
  order: number;
  title: string;
  url: string;
  target: string;
  classes: string[];
  type: string;
  object: string;
  object_id: number;
}

export interface Menu {
  id: number;
  name: string;
  slug: string;
  items: MenuItem[];
}

export interface MembersResponse {
  count: number;
  members: Member[];
}

export interface Member {
  MemberName: string;
  MemberImage: string;
  MemberAge: number;
  MemberAges: string;
  City: string;
  Region: string;
  Country: string;
  Headline: string;
  Description: string;
  Interests: string;
  Rating: number;
  IdVerified: boolean;
}

// ---------- API ----------

export const wp = {
  async getSiteSettings(): Promise<SiteSettings> {
    return wpFetch<SiteSettings>('/astro/v1/site-settings');
  },

  async getMenus(): Promise<Record<string, Menu>> {
    return wpFetch<Record<string, Menu>>('/astro/v1/menus');
  },

  async getMembers(opts: { limit?: number; city?: string; region?: string } = {}): Promise<MembersResponse> {
    const params = new URLSearchParams();
    if (opts.limit) params.set('limit', String(opts.limit));
    if (opts.city) params.set('city', opts.city);
    if (opts.region) params.set('region', opts.region);
    const qs = params.toString();
    return wpFetch<MembersResponse>(`/astro/v1/members${qs ? `?${qs}` : ''}`);
  },

  async getNiches(): Promise<Niche[]> {
    return wpFetch<Niche[]>('/wp/v2/niches?per_page=100');
  },

  async getLocations(): Promise<Location[]> {
    return wpFetch<Location[]>('/wp/v2/locations?per_page=100');
  },

  async getLandingPages(): Promise<LandingPage[]> {
    // The wp/v2 endpoint returns the raw post shape with meta_compact carrying
    // location_slug/niche_slug (added by the mu-plugin) so we can build paths in one request.
    type Raw = WpPostBase & { acf: { page_sections?: Section[] } };
    const raw = await wpFetch<Raw[]>('/wp/v2/landing-pages?per_page=100');
    return raw.map(r => ({
      id: r.id,
      title: r.title.rendered,
      slug: r.slug,
      permalink: r.permalink,
      location: {
        id: Number(r.meta_compact.location_id),
        title: r.meta_compact.location_title ?? '',
        slug: r.meta_compact.location_slug ?? '',
      },
      niche: {
        id: Number(r.meta_compact.niche_id),
        title: r.meta_compact.niche_title ?? '',
        slug: r.meta_compact.niche_slug ?? '',
      },
      acf: r.acf ?? {},
    }));
  },

  async getLandingPage(locationSlug: string, nicheSlug: string): Promise<LandingPage | null> {
    try {
      return await wpFetch<LandingPage>(`/astro/v1/landing/${locationSlug}/${nicheSlug}`);
    } catch (err) {
      // 404 is expected for combinations without a generated landing page.
      if (err instanceof Error && err.message.includes('404')) return null;
      throw err;
    }
  },

  async getPosts(opts: { limit?: number } = {}): Promise<WpPost[]> {
    const limit = opts.limit ?? 6;
    type Raw = WpPost & { _embedded?: unknown };
    const raw = await wpFetch<Raw[]>(`/wp/v2/posts?per_page=${limit}&_fields=id,slug,date,title,excerpt,link,featured_image`);
    return raw.map(p => ({
      id: p.id,
      slug: p.slug,
      date: p.date,
      title: p.title,
      excerpt: p.excerpt,
      link: p.link,
      featured_image: p.featured_image ?? null,
    }));
  },

  async getMedia(id: number): Promise<WpImage | null> {
    if (!id) return null;
    try {
      type Raw = {
        id: number;
        source_url: string;
        alt_text: string;
        media_details: { width: number; height: number };
      };
      const m = await wpFetch<Raw>(`/wp/v2/media/${id}`);
      return {
        id: m.id,
        url: m.source_url,
        width: m.media_details?.width ?? 0,
        height: m.media_details?.height ?? 0,
        alt: m.alt_text ?? '',
      };
    } catch {
      return null;
    }
  },
};

/**
 * SiteContext bundles the per-site settings + all menus into a single object
 * fetched once per build. Pages call `getSiteContext()` instead of hitting
 * /site-settings and /menus separately.
 */
export interface SiteContext {
  settings: SiteSettings;
  menus: Record<string, Menu>;
}

let siteContextPromise: Promise<SiteContext> | null = null;

export function getSiteContext(): Promise<SiteContext> {
  if (!siteContextPromise) {
    siteContextPromise = Promise.all([wp.getSiteSettings(), wp.getMenus()]).then(
      ([settings, menus]) => ({ settings, menus }),
    );
  }
  return siteContextPromise;
}

/**
 * Resolve an ACF MenuRef (term_id, slug string, or term object) to a Menu
 * from the menus map. Returns undefined if not found.
 */
export function resolveMenu(menus: Record<string, Menu>, ref: MenuRef | undefined): Menu | undefined {
  if (!ref) return undefined;
  if (typeof ref === 'object') {
    return Object.values(menus).find(m => m.id === ref.term_id);
  }
  const asNum = Number(ref);
  if (!Number.isNaN(asNum)) {
    return Object.values(menus).find(m => m.id === asNum);
  }
  return menus[String(ref)];
}

/**
 * Walk a sections array, resolve any numeric image IDs into full WpImage objects.
 * Mutates a deep copy and returns it. Batched + cached so multiple sections referencing
 * the same image only fetch once.
 *
 * Currently handles keys whose name ends in `_image` or `_background_image`.
 */
export async function resolveSectionImages(sections: Section[]): Promise<Section[]> {
  const ids = new Set<number>();
  const collect = (val: unknown): void => {
    if (typeof val !== 'object' || val === null) return;
    for (const [k, v] of Object.entries(val)) {
      if ((k.endsWith('_image') || k.endsWith('_background_image')) && typeof v === 'number') {
        ids.add(v);
      } else if (typeof v === 'object' && v !== null) {
        collect(v);
      }
    }
  };
  sections.forEach(collect);

  const resolved = new Map<number, WpImage | null>();
  await Promise.all([...ids].map(async id => resolved.set(id, await wp.getMedia(id))));

  const swap = (val: unknown): unknown => {
    if (Array.isArray(val)) return val.map(swap);
    if (typeof val !== 'object' || val === null) return val;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val)) {
      if ((k.endsWith('_image') || k.endsWith('_background_image')) && typeof v === 'number') {
        out[k] = resolved.get(v) ?? null;
      } else {
        out[k] = swap(v);
      }
    }
    return out;
  };

  return sections.map(s => swap(s) as Section);
}
