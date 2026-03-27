require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');
const Parser = require('rss-parser');
const { Telegraf } = require('telegraf');
const BRAND = require('./brand');
const { initBot } = require('./index');
let bot, startBot, handleUpdate;

const app = express();
const parser = new Parser();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

function detectCategory(title) {
  const text = title.toLowerCase();
  
  const cricketPatterns = [
    /\bcricket\b/i, /\bipl\b/i, /\bt20\b/i, /\btest match\b/i, /\bodi\b/i, 
    /\bcricket world cup\b/i, /\bicc\b/i, /\bbpl\b/i, /\bbbl\b/i, /\bcpl\b/i, /\bpsl\b/i,
    /\bpakistan super league\b/i, /\bpsl 202/i, /\bpakistan cricket\b/i,
    /\bbowler\b/i, /\bbatsman\b/i, /\bbatter\b/i, /\bbatting\b/i, /\bfielder\b/i,
    /\brun out\b/i, /\bsixer\b/i, /\bcentury\b/i, /\bwicket\b/i, /\bpitch\b/i,
    /\bashes\b/i, /\bcsk\b/i, /\brcb\b/i, /\bmi\b/i, /\bkkr\b/i, /\bsrh\b/i,
    /\bdc\b/i, /\brr\b/i, /\bgt\b/i, /\blsg\b/i,
    /\bvirat\b/i, /\bkohli\b/i, /\brohit\b/i, /\bdhoni\b/i, /\bbumrah\b/i,
    /\bsachin\b/i, /\bgavaskar\b/i, /\bdravid\b/i,
    /\bt20i\b/i, /\btest cricket\b/i,
    /\bashwin\b/i, /\bkuldeep\b/i, /\bhardik\b/i, /\bshubman\b/i, /\bijais/i,
    /\bsuryakumar\b/i, /\bpant\b/i, /\bkl Rahul\b/i, /\brahul\b/i, /\bsamson\b/i,
    /\bpandya\b/i, /\bshreyas\b/i, /\biyer\b/i, /\barshdeep\b/i, /\bsiraj\b/i,
    /\bshaw\b/i, /\bgill\b/i, /\brahane\b/i, /\bpujara\b/i, /\bvijay\b/i,
    /\bumesh\b/i, /\bbhuvneshwar\b/i, /\bash Nehra\b/i, /\byadav\b/i,
    /\bsharma\b/i, /\bsc\b/i,
    /\bpakistan\b/i, /\bpcb\b/i, /\bshaheen\b/i, /\bbabar\b/i, /\brizwan\b/i,
    /\bimam\b/i, /\bsarfaraz\b/i, /\bafridi\b/i, /\bshahid\b/i, /\bnawaz\b/i,
    /\bquetta\b/i, /\bkarachi\b/i, /\blahore\b/i, /\bpeshawar\b/i, /\bmultan\b/i
  ];
  
  const footballPatterns = [
    /\bfootball\b/i, /\bsoccer\b/i, 
    /\bpremier league\b/i, /\bla liga\b/i, /\bserie a\b/i, /\bbundesliga\b/i, /\bligue 1\b/i,
    /\bchampions league\b/i, /\beuropa league\b/i, /\bfa cup\b/i, /\beuro 202/i,
    /\btransfer\b/i, /\btransfer news\b/i,
    /\bgoalkeeper\b/i, /\bdefender\b/i, /\bmidfielder\b/i, /\bforward\b/i, /\bstriker\b/i,
    /\barsenal\b/i, /\bchelsea\b/i, /\bliverpool\b/i, /\bmanchester\b/i,
    /\bbarcelona\b/i, /\breal madrid\b/i, /\bbayern\b/i, /\bpsg\b/i, 
    /\bjuventus\b/i, /\bmilan\b/i, /\binter\b/i,
    /\bpenalty\b/i, /\boffside\b/i, /\bfree kick\b/i, /\byellow card\b/i, /\bred card\b/i
  ];
  
  const excludePatterns = [
    /\bskiing\b/i, /\balpine\b/i, /\bf1\b/i, /\bformula\b/i, /\bmotogp\b/i,
    /\bgolf\b/i, /\bboxing\b/i, /\bathletics\b/i, /\brugby\b/i, /\bufc\b/i
  ];
  
  const hasExcluded = excludePatterns.some(p => p.test(text));
  
  const basketballPatterns = [
    /\bbasketball\b/i, /\bnba\b/i, /\bplayoffs\b/i, /\bfinals\b/i,
    /\blebron\b/i, /\bjordan\b/i, /\bcurry\b/i, /\bkobe\b/i, /\bgiannis\b/i, /\bdurant\b/i,
    /\bembiid\b/i, /\blakers\b/i, /\bceltics\b/i, /\bwarriors\b/i, /\bbulls\b/i,
    /\bthree-pointer\b/i, /\bdunk\b/i
  ];
  
  const tennisPatterns = [
    /\btennis\b/i, /\bwimbledon\b/i, /\bus open\b/i, /\bfrench open\b/i, /\baustralian open\b/i,
    /\batp\b/i, /\bwta\b/i, /\bgrand slam\b/i,
    /\bfederer\b/i, /\bnadal\b/i, /\bdjokovic\b/i, /\balcaraz\b/i, /\bsinner\b/i,
    /\bgauff\b/i, /\bswiatek\b/i
  ];
  
  const cricketScore = cricketPatterns.filter(p => p.test(text)).length;
  const footballScore = footballPatterns.filter(p => p.test(text)).length;
  const basketballScore = basketballPatterns.filter(p => p.test(text)).length;
  const tennisScore = tennisPatterns.filter(p => p.test(text)).length;
  
  if (cricketScore > 0 && cricketScore >= footballScore && cricketScore >= basketballScore && cricketScore >= tennisScore) {
    return 'cricket';
  }
  if (footballScore > 0 && !hasExcluded && footballScore >= cricketScore && footballScore >= basketballScore && footballScore >= tennisScore) {
    return 'football';
  }
  if (basketballScore > 0) {
    return 'basketball';
  }
  if (tennisScore > 0) {
    return 'tennis';
  }
  
  return 'general';
}

const NEWS_SOURCES = [
  { name: 'ESPN Cricinfo', url: 'https://www.espncricinfo.com/rss/content/story/feeds/6.xml', lang: 'en' },
  { name: 'ESPN Global', url: 'https://www.espncricinfo.com/rss/content/story/feeds/5.xml', lang: 'en' },
  { name: 'Cricket Addictor', url: 'https://cricketaddictor.com/feed', lang: 'en' },
  { name: 'CricTracker', url: 'https://www.crictracker.com/feed', lang: 'en' },
  { name: 'Sky Sports Cricket', url: 'https://www.skysports.com/rss/12040', lang: 'en' },
  { name: 'Cricket Next', url: 'https://www.cricketnext.com/feed/rss/cricket', lang: 'en' },
  { name: 'Wisden', url: 'https://www.wisden.com/feed/cricket', lang: 'en' },
  { name: 'Yahoo Soccer', url: 'https://sports.yahoo.com/soccer/rss.xml', lang: 'en' },
  { name: '101 Great Goals', url: 'https://101greatgoals.com/feed', lang: 'en' },
  { name: 'BBC Football', url: 'https://feeds.bbci.co.uk/sport/rss.xml', lang: 'en' },
  { name: 'Sky Sports Football', url: 'https://www.skysports.com/rss/12070', lang: 'en' },
  { name: 'Yahoo Sports', url: 'https://sports.yahoo.com/rss/', lang: 'en' }
];

const CATEGORIES = [
  { id: 'cricket', name: 'Cricket', icon: '🏏', color: BRAND.colors.categories.cricket },
  { id: 'football', name: 'Football', icon: '⚽', color: BRAND.colors.categories.football },
  { id: 'basketball', name: 'Basketball', icon: '🏀', color: BRAND.colors.categories.basketball },
  { id: 'tennis', name: 'Tennis', icon: '🎾', color: BRAND.colors.categories.tennis },
  { id: 'general', name: 'All Sports', icon: '🏆', color: BRAND.colors.categories.general }
];

async function fetchRSS(source) {
  try {
    const feed = await parser.parseURL(source.url);
    const items = feed.items.slice(0, 8);
    
    const results = items.map(item => {
      let image = null;
      if (item.enclosure && item.enclosure.url) {
        image = item.enclosure.url;
      } else if (item.media && item.media.content && item.media.content.url) {
        image = item.media.content.url;
      } else if (item['media:thumbnail'] && item['media:thumbnail'].url) {
        image = item['media:thumbnail'].url;
      } else if (item.content && item.content.includes('src="')) {
        const match = item.content.match(/src="([^"]+)"/);
        if (match) image = match[1];
      } else if (item['content:encoded'] && item['content:encoded'].includes('<img')) {
        const match = item['content:encoded'].match(/<img[^>]+src="([^"]+)"/);
        if (match) image = match[1];
        if (!image) {
          const match2 = item['content:encoded'].match(/<img[^>]+data-src="([^"]+)"/);
          if (match2) image = match2[1];
        }
      }
      
      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        source: source.name,
        category: detectCategory(item.title || ''),
        image: image
      };
    });
    
    return results;
  } catch (error) {
    console.log(`Failed to fetch ${source.name}: ${error.message}`);
    return [];
  }
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
  ]);
}

function normalizeTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 50);
}

function removeDuplicates(news) {
  const seen = new Set();
  const unique = [];
  
  for (const item of news) {
    const normalized = normalizeTitle(item.title);
    if (!seen.has(normalized)) {
      seen.add(normalized);
      unique.push(item);
    }
  }
  
  return unique;
}

app.get('/trending', async (req, res) => {
  try {
    const allNews = [];
    
    const newsPromises = NEWS_SOURCES.map(source => 
      withTimeout(fetchRSS(source), 8000).catch(() => [])
    );
    
    const results = await Promise.all(newsPromises);
    results.forEach(items => allNews.push(...items));
    
    const uniqueNews = removeDuplicates(allNews);
    
    const sortedNews = uniqueNews
      .sort((a, b) => {
        const dateA = new Date(a.pubDate).getTime();
        const dateB = new Date(b.pubDate).getTime();
        return dateB - dateA;
      })
      .slice(0, 25);
    
    const byCategory = {};
    CATEGORIES.forEach(cat => {
      byCategory[cat.id] = sortedNews
        .filter(item => item.category === cat.id)
        .slice(0, 8);
    });
    
    res.json({
      trending: sortedNews.slice(0, 15),
      categories: CATEGORIES,
      byCategory
    });
  } catch (error) {
    console.error('Trending error:', error.message);
    res.status(500).json({ error: 'Failed to fetch trending news' });
  }
});

const SUPPORTED_SITES = {
  'bbc.com': { selector: '[data-component="text-block"] p, article p, .article-body p' },
  'skysports.com': { selector: '.article__body p, .sdc-article-body p' },
  'cricbuzz.com': { selector: '.cb-nws-intr, .cb-ns-lst-intr, .cb-art-text, .cb-col-60' },
  'goal.com': { selector: '.article-body p, .content p' },
  'espn.com': { selector: '.article-body p, .Storyline__Body p' },
  'sportskeeda.com': { selector: '.article-content p, .story-content p' },
  'icc-cricket.com': { selector: '.article__content p, .rich-text p' },
  'fifa.com': { selector: '.article-body p, .ArticleContent p' },
  'google.com': { selector: 'article p, .GI QE7jne' },
  'foxsports.com': { selector: '.article-body p' },
  'bleacherreport.com': { selector: '.article-body p' },
  'cricketaddictor.com': { selector: 'article p, .entry-content p, .post-content p, .content p' },
  'crictracker.com': { selector: 'article p, .entry-content p, .post-content p, .content p' },
  'wisden.com': { selector: 'article p, .entry-content p, .post-content p' },
  'cricketnext.com': { selector: 'article p, .entry-content p, .post-content p' },
  'sports.yahoo.com': { selector: 'article p, .caas-body p, .entry-content p' },
  '101greatgoals.com': { selector: 'article p, .entry-content p, .post-content p' },
  'theguardian.com': { selector: 'article p, .article-body p' },
  'telegraph.co.uk': { selector: 'article p, .article-body p' },
  'mirror.co.uk': { selector: 'article p, .article-body p' },
  'express.co.uk': { selector: 'article p, .article-body p' }
};

function detectSite(url) {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    for (const site of Object.keys(SUPPORTED_SITES)) {
      if (hostname.includes(site.replace('www.', ''))) {
        return site;
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function scrapeNews(url, customSelector = null) {
  const site = detectSite(url);
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    
    let content = '';
    
    // Use custom selector if provided
    if (customSelector) {
      $(customSelector).each((i, el) => {
        const text = $(el).text().trim();
        if (text.length > 50) {
          content += text + ' ';
        }
      });
    }
    
    // Otherwise try site-specific selector
    if (!content.trim() && site && SUPPORTED_SITES[site]) {
      $(SUPPORTED_SITES[site].selector).each((i, el) => {
        const text = $(el).text().trim();
        if (text.length > 50) {
          content += text + ' ';
        }
      });
    }

    // Fallback to generic selectors
    if (!content.trim()) {
      $('article p, .article p, main p, .content p').each((i, el) => {
        const text = $(el).text().trim();
        if (text.length > 50) {
          content += text + ' ';
        }
      });
    }

    content = content.trim().replace(/\s+/g, ' ');
    
    if (content.length < 100) {
      content = $('body').text().trim().replace(/\s+/g, ' ').substring(0, 2000);
    }

    return content;
  } catch (error) {
    throw new Error('Failed to fetch URL: ' + error.message);
  }
}

app.post('/fetch-url', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const site = detectSite(url);
  
  // If site not detected, try to scrape anyway with generic selectors
  let customSelector = null;
  if (!site) {
    try {
      const hostname = new URL(url).hostname.replace('www.', '');
      customSelector = 'article p, .article-content p, .post-content p, .entry-content p, .content p, main p';
    } catch (e) {
      // continue
    }
  }

  try {
    const content = await scrapeNews(url, customSelector);
    res.json({ content, site: site || 'unknown' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/analyze', async (req, res) => {
  const { text, url } = req.body;
  
  let fullPost = text;

  if (url) {
    try {
      fullPost = await scrapeNews(url);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch URL: ' + error.message });
    }
  }

  if (!fullPost) {
    return res.status(400).json({ error: 'Please provide text or a valid URL' });
  }

  const squadPatterns = [/squad\s*[:\-]?/i, /playing\s*xi/i, /lineup/i, /team\s*selection/i, /full\s*team/i, /predicted\s*xi/i, /probable\s*xi/i, /final\s*squad/i];
  const hasSquadInfo = squadPatterns.some(p => p.test(fullPost));
  
  let squadInfo = '';
  if (hasSquadInfo) {
    const lines = fullPost.split('\n');
    for (const line of lines) {
      if (squadPatterns.some(p => p.test(line))) {
        squadInfo += line + '\n';
      }
    }
  }

  try {
    const systemMsg = hasSquadInfo 
      ? "You are an Elite Sports Analyst. Read the full sports post and provide the best outcome/summary in 2-3 punchy English sentences with bullet points and emojis. Make it engaging and professional. IMPORTANT: If the article contains Squad, Playing XI, Team Lineup, or Team information, include it prominently in your summary. Highlight key players and team composition."
      : "You are an Elite Sports Analyst. Read the full sports post and provide the best outcome/summary in 2-3 punchy English sentences with bullet points and emojis. Make it engaging and professional.";
      
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "openai/gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: systemMsg
        },
        { 
          role: "user", 
          content: `Here is the full post: ${fullPost}. Give me the best outcome.` 
        }
      ]
    }, {
      headers: { 
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'SportsAIBot'
      }
    });

    res.json({ result: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data?.message || error.message || 'সার্ভারে কোনো সমস্যা হয়েছে!' });
  }
});

function extractFirstValidJSON(str) {
  const markers = ['<|end_header_id|>', '```', 'Here is', 'Here\'s', 'Sure', 'Here\'s the'];
  
  for (const marker of markers) {
    const idx = str.indexOf(marker);
    if (idx > 0 && idx < str.length / 2) {
      str = str.substring(0, idx).trim();
      break;
    }
  }
  
  let cleaned = str
    .replace(/```json/gi, '')
    .replace(/```/gi, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/,\s*}/g, '}')
    .replace(/,\s*]/g, ']')
    .replace(/\[\s*,/g, '[')
    .replace(/,\s*\]/g, ']')
    .replace(/hashtag(?!\s*:)/gi, 'hashtags')
    .replace(/hashtagss/gi, 'hashtags')
    .replace(/'([^']*?)'/g, '"$1"')
    .replace(/`/g, '"')
    .trim();
  
  if (cleaned.startsWith('{')) {
    let openBraces = 0;
    let closeBraces = 0;
    let inString = false;
    let escaped = false;
    
    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned[i];
      
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === '\\') {
        escaped = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        continue;
      }
      
      if (!inString) {
        if (char === '{') openBraces++;
        if (char === '}') closeBraces++;
        
        if (openBraces > 0 && openBraces === closeBraces) {
          cleaned = cleaned.substring(0, i + 1);
          break;
        }
      }
    }
  }
  
  return cleaned;
}

function cleanJSONString(str) {
  return extractFirstValidJSON(str);
}

function generateFallbackPosts(articleText) {
  const text = articleText.substring(0, 100);
  
  return [
    {
      type: 'Informative',
      fbCaption: `${text}... What do you think? Drop your thoughts below! 👇`,
      hashtags: ['Sports', 'News', 'Cricket', 'Football'],
      imagePrompt: `Sports news illustration related to ${text}`
    },
    {
      type: 'Emotional',
      fbCaption: `This is HUGE! 😱 What are your thoughts on ${text}?`,
      hashtags: ['SportsNews', 'Trending', 'Viral'],
      imagePrompt: `Exciting sports moment, dramatic lighting, crowd reaction`
    },
    {
      type: 'Controversial',
      fbCaption: `Hot take 🔥 What's your take on ${text}? Comment below!`,
      hashtags: ['SportsDebate', 'Opinion', 'Cricket', 'Football'],
      imagePrompt: `Sports controversy, heated discussion, two opposing views`
    },
    {
      type: 'Aura',
      fbCaption: `Complete match coverage: ${text}. All the key statistics, player performances, and highlights you need to know. Stay informed with SPORTS247.`,
      hashtags: ['SPORTS247', 'MatchReport', 'Statistics', 'Highlights'],
      imagePrompt: `Professional sports broadcast studio with scoreboard and match statistics display`
    }
  ];
}

function tryParseJSON(str) {
  try {
    return { success: true, data: JSON.parse(str) };
  } catch (e) {
    let attempt = str
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .replace(/'([^']*?)'/g, '"$1"')
      .replace(/hashtag(?!\s*:)/gi, 'hashtags')
      .replace(/hashtagss/gi, 'hashtags');
    
    try {
      return { success: true, data: JSON.parse(attempt) };
    } catch (e2) {
      try {
        const fixed = attempt
          .replace(/([{,]\s*)(\w+):/g, '$1"$2":')
          .replace(/: ([^",\[\]{}]+)([,}\]])/g, ': "$1"$2');
        return { success: true, data: JSON.parse(fixed) };
      } catch (e3) {
        const arrayMatch = str.match(/\[[\s\S]*\{[\s\S]*\}[\s\S]*\]/);
        if (arrayMatch) {
          try {
            return { success: true, data: { posts: JSON.parse(arrayMatch[0]) } };
          } catch {}
        }
        return { success: false, error: e.message };
      }
    }
  }
}

function detectSport(text) {
  const sports = {
    cricket: /cricket|ipl|t20|world cup|test match|odi|bcc|icc/i,
    football: /football|soccer|premier league|la liga|champions league|euro|world cup|fa cup/i,
    basketball: /basketball|nba|wnba|olympics|iihf/i,
    tennis: /tennis|wimbledon|us open|french open|grand slam|australian open/i,
    hockey: /hockey|nhl|field hockey|olympics/i,
    racing: /formula|f1|racing|motorsport|nascar/i,
    boxing: /boxing|mma|ufc|fight|championship/i,
    golf: /golf|pga|tour|majors/i
  };
  for (const [sport, pattern] of Object.entries(sports)) {
    if (pattern.test(text)) return sport;
  }
  return 'sports';
}

function extractVisualKeywords(title, text) {
  const keywords = [];
  
  const teamPatterns = [
    /Mumbai Indians|Chennai Super Kings|Royal Challengers Bangalore|Kolkata Knight Riders|Delhi Capitals|Punjab Kings|Rajasthan Royals|Sunrisers Hyderabad|Lucknow Super Giants|GT|Gujarat Titans/i,
    /Manchester United|Manchester City|Liverpool|Arsenal|Chelsea|Tottenham|Real Madrid|Barcelona|Bayern Munich|PSG|Juventus/i,
    /India|Australia|England|South Africa|New Zealand|Pakistan|Sri Lanka|Brazil|ARGentina|France|Germany/i
  ];
  
  const playerPatterns = [
    /Virat Kohli|Rohit Sharma|MS Dhoni|Hardik Pandya|Jasprit Bumrah|Ravindra Jadeja|Suryakumar Yadav/i,
    /Cristiano Ronaldo|Lionel Messi|Mbappe|Haaland|Neymar|MODric|De Bruyne/i,
    /LeBron James|Stephen Curry|Kevin Durant|Giannis|Jokic/i
  ];
  
  for (const pattern of teamPatterns) {
    const match = text.match(pattern);
    if (match) keywords.push(match[0]);
  }
  
  for (const pattern of playerPatterns) {
    const match = text.match(pattern);
    if (match && !keywords.includes(match[0])) keywords.push(match[0]);
  }
  
  return keywords.length > 0 ? keywords : ['sports action'];
}

function getSportScene(sport) {
  const scenes = {
    cricket: "CRICKET SCENES: Show cricket stadium, players in cricket whites or team jerseys, bats, balls, boundary rope, cheerleaders, crowd. Action shots: batting, bowling, fielding, celebrations. Stadium lighting, dramatic moments.",
    football: "FOOTBALL SCENES: Show football pitch, players in team kits, goal posts, crowd in stadium, banners. Action shots: goals, tackles, celebrations, manager on sidelines. Green pitch, floodlights, dramatic atmosphere.",
    basketball: "BASKETBALL SCENES: Show basketball court, players in jersey, hoop, crowd. Action shots: slam dunks, three-point shots, defense, celebrations. Arena lights, dynamic movement.",
    tennis: "TENNIS SCENES: Show tennis court, player with racket, net, crowd in stands. Action shots: serves, volleys, winners. Grand slam atmosphere, stadium, excited crowd.",
    hockey: "HOCKEY SCENES: Show hockey rink, players with sticks, puck, goal. Action shots: slap shots, saves, collisions. Ice arena, fast action, crowd.",
    racing: "RACING SCENES: Show race track, cars/bikes, pit lane, crowd. Action shots: overtaking, finish line, podium celebration. Speed, motion blur, grandstands.",
    boxing: "BOXING SCENES: Show boxing ring, fighters in gloves, crowd, lights. Action shots: punches, knockout, celebration. Dramatic lighting, intensity.",
    golf: "GOLF SCENES: Show golf course, golfer with club, hole, crowd. Action shots: swing, putt, celebrations on green. Scenic course, beautiful landscape.",
    sports: "SPORTS SCENES: Show dynamic sports action, athletes in action, stadium/court setting, crowd atmosphere. Professional sports photography, dramatic lighting."
  };
  return scenes[sport] || scenes['sports'];
}

app.post('/generate-fb-visual', async (req, res) => {
  const { articleText, articleTitle, referenceImage } = req.body;

  if (!articleText) {
    return res.status(400).json({ error: 'articleText is required' });
  }

  const squadPatterns = [/squad\s*[:\-]?/i, /playing\s*xi/i, /lineup/i, /team\s*selection/i, /full\s*team/i, /predicted\s*xi/i, /probable\s*xi/i, /final\s*squad/i];
  const hasSquadInfo = squadPatterns.some(p => p.test(articleText));

  const articleInfo = articleTitle ? `Article Title: ${articleTitle}. ` : '';
  
  const sportType = detectSport(articleTitle + ' ' + articleText);
  const visualKeywords = extractVisualKeywords(articleTitle, articleText);
  
  const referenceInfo = referenceImage ? `Reference image available: ${referenceImage}` : '';
  const sportScene = getSportScene(sportType);

  try {
    const squadInstruction = hasSquadInfo 
      ? "IMPORTANT: The article contains squad/team lineup information. Include the key players, playing XI, or team composition in the posts. Make the squad details a prominent part of each caption."
      : "";

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "meta-llama/llama-3.1-8b-instruct",
      messages: [
        {
          role: "system",
          content: `You are a JSON generator. Your ONLY task is to output valid JSON. Do NOT include any text before or after the JSON. Do NOT use markdown code blocks. Do NOT add explanations or introductions. Start directly with { and end with }.

CRITICAL - IMAGE PROMPTS MUST BE VISUAL SCENES:
- Do NOT write: "Sports news illustration about X" or "Title text with logo"
- Do NOT create text posters or news graphics
- ONLY describe VISUAL SCENES that can be photographed or painted

IMAGE PROMPT EXAMPLES (what to do):
- "Professional football stadium at night, floodlights on, Real Madrid players in white kits training, dramatic sky, photorealistic"
- "Soccer player celebrating goal, blue and white jersey, stadium crowd cheering, confetti, action shot, vivid colors"
- "Tennis player serving, court view, stadium stands full, Wimbledon atmosphere, bright daylight"

IMAGE PROMPT ANTI-EXAMPLES (what NOT to do):
- "Sports news about Real Madrid" ❌
- "News illustration with title and logo" ❌
- "Article graphic with team name" ❌

${sportScene}

Write REAL, SPECIFIC captions from the article content - not generic templates. Use actual teams, players, scores from the article.

Generate EXACTLY 4 posts in JSON format:
{"posts":[{"type":"Emotional","fbCaption":"caption","hashtags":["tag1"],"imagePrompt":"visual scene description"},{"type":"Controversial","fbCaption":"caption","hashtags":["tag1"],"imagePrompt":"visual scene description"},{"type":"Informative","fbCaption":"caption","hashtags":["tag1"],"imagePrompt":"visual scene description"},{"type":"Aura","fbCaption":"caption","hashtags":["tag1"],"imagePrompt":"visual scene description"}]}`
        },
        {
          role: "user",
          content: `${articleInfo}${referenceInfo}Sport: ${sportType}. Key elements: ${visualKeywords.join(', ')}. Create 4 posts with REAL visual scene descriptions (not text graphics) for this article: ${articleText.substring(0, 3000)}`
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'SportsAIBot'
      }
    });

    const content = response.data.choices[0].message.content;
    console.log('Raw AI response:', content.substring(0, 300));

    let jsonStr = content;
    const patterns = [
      /```json\s*([\s\S]*?)\s*```/gi,
      /```\s*(\{[\s\S]*?\})\s*```/gi,
      /^\s*\{[\s\S]*\}\s*$/gi
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        jsonStr = match[0]
          .replace(/```json/gi, '')
          .replace(/```/gi, '')
          .trim();
        break;
      }
    }

    jsonStr = cleanJSONString(jsonStr);
    console.log('Cleaned JSON:', jsonStr.substring(0, 500));

    const parseResult = tryParseJSON(jsonStr);
    
    if (!parseResult.success) {
      console.log('First parse failed, trying raw content...');
      const rawResult = tryParseJSON(content);
      if (rawResult.success) {
        console.log('Successfully parsed from raw content');
        return res.json({ posts: rawResult.data.posts || [rawResult.data] });
      }
    }
    
    if (!parseResult.success) {
      console.error('JSON Parse Error:', parseResult.error);
      
      const fallbackPosts = generateFallbackPosts(articleText);
      if (fallbackPosts.length > 0) {
        console.log('Using fallback posts');
        return res.json({ posts: fallbackPosts });
      }
      
      throw new Error(`JSON parsing failed: ${parseResult.error}`);
    }
    
    const parsed = parseResult.data;
    console.log('Successfully parsed JSON');

    let postsArray = [];
    
    if (parsed.posts && Array.isArray(parsed.posts)) {
      postsArray = parsed.posts.map(post => ({
        type: post.type || 'Informative',
        fbCaption: post.fbCaption || '',
        hashtags: Array.isArray(post.hashtags) ? post.hashtags : (post.hashtag ? [post.hashtag] : []),
        imagePrompt: post.imagePrompt || ''
      }));
    } else if (parsed.fbCaption) {
      postsArray.push({
        type: 'Informative',
        fbCaption: parsed.fbCaption,
        hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : [],
        imagePrompt: parsed.imagePrompt || ''
      });
    }

    if (postsArray.length === 0) {
      const fallbackPosts = generateFallbackPosts(articleText);
      return res.json({ posts: fallbackPosts });
    }

    res.json({ posts: postsArray });
  } catch (error) {
    console.error('=== Generate FB Visual Error ===');
    console.error('Error Message:', error.message);
    console.error('================================');
    res.status(500).json({ error: error.message || 'Failed to generate visual content' });
  }
});

const PORT = 3000;

// Size presets for different platforms
const SIZE_PRESETS = {
  'instagram-square': { width: 1080, height: 1080, label: 'Instagram Post (1080×1080)' },
  'instagram-story': { width: 1080, height: 1920, label: 'Instagram Story (1080×1920)' },
  'facebook-post': { width: 1200, height: 630, label: 'Facebook Post (1200×630)' },
  'facebook-cover': { width: 820, height: 312, label: 'Facebook Cover (820×312)' },
  'youtube-thumbnail': { width: 1280, height: 720, label: 'YouTube Thumbnail (1280×720)' },
  'custom': { width: 1024, height: 1024, label: 'Custom Size' }
};

// Style presets for image generation
const STYLE_PRESETS = BRAND.stylePresets;

// Title bar background colors
const TITLE_BAR_COLORS = BRAND.titleBarColors;

// Title bar text colors
const TITLE_BAR_TEXT_COLORS = BRAND.titleBarTextColors;

// Sports keyword mappings for smart prompt enhancement
const SPORTS_KEYWORDS = {
  'goal|scoring|scored|striker|football|soccer|net': 'dramatic lighting, celebration moment, crowd cheering, confetti, action shot',
  'cricket|batting|bowling|wicket|ipl|test match|boundary': 'cricket stadium, pitch visible, floodlights, dynamic action, professional sports photography',
  'basketball|dunk|nba|hoop|slam': 'indoor arena, court lines visible, dynamic movement, sweat droplets, arena lights',
  'tennis|ace|serve|grand slam|racket': 'tennis court, net visible, athletic pose, outdoor lighting, professional tournament',
  'champion|trophy|winner|victory|final|gold': 'golden lighting, victorious atmosphere, sparkle effect, podium, confetti celebration',
  'stadium|arena|field|pitch|ground|match|game|live': 'massive crowd in background, stadium lights, atmospheric haze, epic scale',
  'player|athlete|star|legend|captain|star': 'dynamic action pose, motion blur, intense expression, professional sports portrait',
  'team|squad|club|squad|lineup': 'team unity, group composition, matching uniforms, team spirit',
  'training|practice|workout|fitness|gym': 'focused intensity,汗水 details, gym equipment, determination',
  'world cup|worldcup|champions league|premier league': 'tournament atmosphere, global event feel, prestigious, grand scale',
  'running|sprint|race|marathon': 'motion blur, speed lines, athletic physique, outdoor track or road'
};

// Quality modifiers always added
const QUALITY_MODIFIERS = BRAND.qualityModifiers;

// Default sports enhancement when no keywords match
const DEFAULT_SPORT_ENHANCEMENT = BRAND.defaultEnhancement;

// Trending modifiers for artistic appeal
const TRENDING_MODIFIERS = BRAND.trendingModifiers;

// Negative prompts for better AI results
const NEGATIVE_PROMPTS = BRAND.negativePrompts;

// Function to extract keywords from text
function extractKeywords(text) {
  const stopwords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'any', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'has', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'way', 'who', 'did', 'get', 'let', 'say', 'she', 'too', 'use']);
  const words = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopwords.has(w));
  // Remove duplicates
  const unique = [...new Set(words)];
  // Return top 5 keywords
  return unique.slice(0, 5);
}

// Function to enhance prompts specifically for AI image generation (Pollinations, etc.)
function enhanceImagePrompt(prompt, sportType = 'sports') {
  const promptLower = prompt.toLowerCase();
  
  // Avoid certain unwanted elements
  const avoidTerms = ['text', 'words', 'letter', 'title', 'logo', 'brand', 'news illustration', 'article graphic'];
  let cleanedPrompt = prompt;
  
  for (const term of avoidTerms) {
    if (promptLower.includes(term) && !promptLower.includes('stadium') && !promptLower.includes('jersey')) {
      cleanedPrompt = cleanedPrompt.replace(new RegExp(term, 'gi'), '');
    }
  }
  
  // Add quality modifiers for better image generation
  const qualityModifiers = 'photorealistic, high quality, detailed, professional photography, dramatic lighting';
  
  // Add sport-specific enhancements
  const sportEnhancements = {
    cricket: 'cricket stadium, players in action, boundary rope, crowd cheering, daylight',
    football: 'football stadium, players in kits, goal post, crowd, floodlights, action shot',
    basketball: 'basketball court, players jumping, hoop, arena lights, dynamic movement',
    tennis: 'tennis court, player with racket, net, crowd, Wimbledon style, bright daylight',
    hockey: 'hockey rink, players with sticks, fast action, ice arena, crowd',
    racing: 'race track, cars speed, pit lane, grandstands, dramatic speed',
    boxing: 'boxing ring, fighters in gloves, dramatic lighting, intense atmosphere',
    golf: 'golf course, golfer swinging, green grass, scenic landscape',
    sports: 'sports stadium, athletes in action, crowd, professional lighting'
  };
  
  const sportEnhancement = sportEnhancements[sportType] || sportEnhancements.sports;
  
  // Build the enhanced prompt
  let enhanced = cleanedPrompt;
  
  // Add sport context if not already present
  if (!promptLower.includes('stadium') && !promptLower.includes('court') && !promptLower.includes('field')) {
    enhanced += `, ${sportEnhancement}`;
  }
  
  // Add quality modifiers
  enhanced += `, ${qualityModifiers}`;
  
  return enhanced.trim().replace(/\s+/g, ' ');
}

// Function to enhance prompt with sports-specific keywords
function enhancePrompt(originalPrompt, style = 'cinematic') {
  const promptLower = originalPrompt.toLowerCase();
  const sportEnhancements = [];
  
  // Detect sports keywords and collect relevant styling
  for (const [keywords, enhancement] of Object.entries(SPORTS_KEYWORDS)) {
    if (new RegExp(keywords).test(promptLower)) {
      sportEnhancements.push(enhancement);
    }
  }
  
  // If no sport keywords matched, use default enhancement
  if (sportEnhancements.length === 0) {
    sportEnhancements.push(DEFAULT_SPORT_ENHANCEMENT);
  }
  
  // Combine enhancements (limit to 2 to avoid prompt bloat)
  const combinedSportEnhancement = sportEnhancements.slice(0, 2).join(', ');
  
  // Extract article keywords for personalization
  const articleKeywords = extractKeywords(originalPrompt);
  const keywordEnhancement = articleKeywords.length > 0 
    ? `, ${articleKeywords.join(' ')}` 
    : '';
  
  // Get style enhancement
  const styleEnhancement = STYLE_PRESETS[style] || STYLE_PRESETS.cinematic;
  
  // Add a random trending modifier
  const trendingModifier = TRENDING_MODIFIERS[Math.floor(Math.random() * TRENDING_MODIFIERS.length)];
  
  // Build enhanced prompt
  let enhanced = originalPrompt;
  
  if (combinedSportEnhancement) {
    enhanced += `, ${combinedSportEnhancement}`;
  }
  
  enhanced += `, ${styleEnhancement}`;
  enhanced += `, ${QUALITY_MODIFIERS}`;
  enhanced += `, ${trendingModifier}`;
  enhanced += keywordEnhancement;
  
  return enhanced;
}

// AI-powered prompt enhancement using OpenRouter
async function aiEnhancePrompt(originalPrompt, style = 'cinematic', width = 1024, height = 1024) {
  try {
    const systemMessage = `You are an expert prompt engineer for AI image generation, specializing in sports imagery. Your task is to rewrite the user's prompt into a detailed, vivid, and effective prompt for Stable Diffusion XL.

Guidelines:
1. Keep the core subject and intent of the original prompt.
2. Add specific, relevant sports details based on the context (e.g., stadium, equipment, action).
3. Naturally integrate the SPORTS247 brand: a red running figure icon with red/white 'SPORTS247' text. Place it as a clean watermark in the top-right corner OR integrate naturally into the scene (e.g., on a player's jersey sleeve, stadium LED screen, arena backdrop, jersey number, corner badge).
4. Incorporate the requested style: ${style}.
5. Ensure the prompt is optimized for SDXL: include lighting, composition, quality tags, but keep it concise.
6. Output ONLY the enhanced prompt, no explanations, no quotes.

Example:
Input: "Messi scoring a goal"
Enhanced: "Lionel Messi in mid-air kick, scoring a spectacular goal, net rippling, crowd cheering, dramatic stadium lighting, SPORTS247 logo on LED screen, cinematic, 4k, ultra detailed, masterpiece"`;

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "meta-llama/llama-3.1-8b-instruct",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: `Original prompt: "${originalPrompt}"\nStyle: ${style}\nImage dimensions: ${width}x${height}\n\nRewrite the prompt:` }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'SportsAIBot'
      },
      timeout: 30000
    });

    const enhanced = response.data.choices[0].message.content.trim();
    console.log('AI enhancement succeeded:', enhanced.substring(0, 100));
    // Remove any surrounding quotes
    return enhanced.replace(/^"|"$/g, '');
  } catch (error) {
    console.error('AI enhancement failed, falling back to rule-based:', error.message);
    // Fallback to rule-based enhancement
    return enhancePrompt(originalPrompt, style);
  }
}

// Function to generate variations of a prompt
function generatePromptVariations(basePrompt, style, baseEnhancedPrompt = null) {
  const base = baseEnhancedPrompt || enhancePrompt(basePrompt, style);
  const variations = [
    { 
      name: "Original", 
      prompt: baseEnhancedPrompt ? base : enhancePrompt(basePrompt, style),
      seed: Math.floor(Math.random() * 100000)
    },
    { 
      name: "Enhanced", 
      prompt: baseEnhancedPrompt ? base + ", dramatic angle, dynamic composition" : enhancePrompt(basePrompt + ", dramatic angle, dynamic composition", style),
      seed: Math.floor(Math.random() * 100000)
    },
    { 
      name: "Creative", 
      prompt: baseEnhancedPrompt ? base + ", artistic interpretation, unique perspective" : enhancePrompt(basePrompt + ", artistic interpretation, unique perspective", style),
      seed: Math.floor(Math.random() * 100000)
    }
  ];
  
  return variations;
}

// Get negative prompt
function getNegativePrompt() {
  return NEGATIVE_PROMPTS.join(", ");
}

app.get('/style-presets', (req, res) => {
  const presets = Object.entries(STYLE_PRESETS).map(([key, value]) => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    description: value.split(',').slice(0, 2).join(', ')
  }));
  res.json(presets);
});

app.get('/titlebar-colors', (req, res) => {
  const colors = Object.entries(TITLE_BAR_COLORS).map(([key, value]) => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    hex: value
  }));
  res.json(colors);
});

app.get('/titlebar-text-colors', (req, res) => {
  const colors = Object.entries(TITLE_BAR_TEXT_COLORS).map(([key, value]) => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    hex: value
  }));
  res.json(colors);
});

app.get('/size-presets', (req, res) => {
  res.json(SIZE_PRESETS);
});

app.post('/generate-visual', async (req, res) => {
  const { prompt, imageFile, logo, title = '', width = 1024, height = 1024, sizePreset, style = 'cinematic', titleBarColor = 'dark', titleBarTextColor = 'white', variations = false, logoPosition = 'top-right', aiEnhance = true, resizeMode = 'cover' } = req.body;
  
  console.log('imageFile received:', imageFile ? (imageFile.substring(0, 50) + '...') : 'none');
  
  console.log('Logo received:', logo ? 'yes, length: ' + logo.length : 'no');

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Use preset size if provided
  let finalWidth = width;
  let finalHeight = height;
  if (sizePreset && SIZE_PRESETS[sizePreset]) {
    finalWidth = SIZE_PRESETS[sizePreset].width;
    finalHeight = SIZE_PRESETS[sizePreset].height;
  }

  try {
    // Enhance the prompt
    let enhancedPrompt;
    if (aiEnhance) {
      enhancedPrompt = await aiEnhancePrompt(prompt, style, finalWidth, finalHeight);
    } else {
      enhancedPrompt = enhancePrompt(prompt, style);
    }
    const negativePrompt = getNegativePrompt();
    
    // Generate prompt variations
    const promptVariations = aiEnhance 
      ? generatePromptVariations(prompt, style, enhancedPrompt)
      : generatePromptVariations(prompt, style);
    
    const sharp = require('sharp');
    const variations = [];
    
    // Function to generate a single image
    async function generateSingleImage(variationPrompt, variationSeed, variationName) {
      let baseImageBuffer;
      
      // Use reference image if provided (base64 or URL)
      if (imageFile) {
        if (imageFile.startsWith('data:image')) {
          // Base64 image
          const refData = imageFile.replace(/^data:image\/\w+;base64,/, '');
          baseImageBuffer = Buffer.from(refData, 'base64');
        } else if (imageFile.startsWith('http')) {
          // URL image - fetch it
          try {
            const imgResponse = await axios.get(imageFile, { responseType: 'arraybuffer', timeout: 30000 });
            baseImageBuffer = Buffer.from(imgResponse.data);
          } catch (imgErr) {
            console.error('Failed to fetch reference image:', imgErr.message);
          }
        }
      }
      
      // If we have a reference image, use it
      let image;
      if (baseImageBuffer) {
        // Use the reference image as base
        image = sharp(baseImageBuffer);
        
        // Resize to target dimensions maintaining aspect ratio (fill & crop to fit)
        image = image.resize(finalWidth, finalHeight, { fit: resizeMode });
        
        // Add dark overlay
        image = image.composite([{
          input: Buffer.from(`<svg width="${finalWidth}" height="${finalHeight}"><rect width="100%" height="100%" fill="rgba(0,0,0,0.25)"/></svg>`),
          top: 0,
          left: 0
        }]);
      } else {
        // Generate AI image using multiple free services
        let generated = false;
        
        // Try method 0: FluxImageGen (free, no auth required)
        if (!generated) {
          try {
            console.log('Trying FluxImageGen (free API)...');
            const fluxResponse = await axios.post('https://fluximagegen.com/api/generate', {
              prompt: variationPrompt,
              style: 'photorealism'
            }, {
              timeout: 60000
            });
            
            if (fluxResponse.data && fluxResponse.data.success && fluxResponse.data.imageUrl) {
              console.log('FluxImageGen URL:', fluxResponse.data.imageUrl);
              const fluxImgResponse = await axios.get(fluxResponse.data.imageUrl, {
                responseType: 'arraybuffer',
                timeout: 60000
              });
              baseImageBuffer = Buffer.from(fluxImgResponse.data);
              generated = true;
              console.log('FluxImageGen image generated successfully');
            }
          } catch (fluxError) {
            console.error('FluxImageGen failed:', fluxError.message);
          }
        }
        
        // Try method 0b: Black Forest Labs FLUX via OpenRouter (if credits available)
        if (!generated && process.env.OPENROUTER_API_KEY) {
          try {
            console.log('Trying Black Forest FLUX via OpenRouter...');
            const fluxResponse = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
              model: "black-forest-labs/flux-1-schnell",
              messages: [
                { role: "user", content: variationPrompt }
              ]
            }, {
              headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://sports247-2.onrender.com',
                'X-Title': 'SPORTS247'
              },
              timeout: 60000
            });
            
            const fluxImageUrl = fluxResponse.data.choices[0].message.content;
            console.log('FLUX generated URL:', fluxImageUrl);
            
            if (fluxImageUrl && fluxImageUrl.startsWith('http')) {
              const fluxImgResponse = await axios.get(fluxImageUrl, {
                responseType: 'arraybuffer',
                timeout: 60000
              });
              baseImageBuffer = Buffer.from(fluxImgResponse.data);
              generated = true;
              console.log('FLUX image generated successfully');
            }
          } catch (fluxError) {
            console.error('FLUX failed:', fluxError.message);
          }
        }
        
        // Try method 1: AI Image Generator (free, no auth)
        if (!generated) {
          try {
            console.log('Trying AI Image Generator API...');
            const aiGenResponse = await axios.post('https://image.pollinations.ai/prompt/' + encodeURIComponent(variationPrompt), {
              width: Math.min(finalWidth, 512),
              height: Math.min(finalHeight, 512),
              nologo: true,
              seed: variationSeed || Math.floor(Math.random() * 10000)
            }, {
              timeout: 60000,
              responseType: 'arraybuffer'
            });
            
            if (aiGenResponse.data && aiGenResponse.data.length > 1000) {
              baseImageBuffer = Buffer.from(aiGenResponse.data);
              generated = true;
              console.log('AI Image Generator worked');
            }
          } catch (aiGenError) {
            console.error('AI Image Generator failed:', aiGenError.message);
          }
        }
        
        // Try method 2: Pollinations with flux model (if it works)
        try {
          const enhancedPrompt = enhanceImagePrompt(variationPrompt, sportType);
          const seed = variationSeed || Math.floor(Math.random() * 10000);
          
          console.log('Trying Pollinations with prompt:', enhancedPrompt.substring(0, 60));
          
          // Try new Pollinations API format
          const pollinUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=${finalWidth}&height=${finalHeight}&nologo=true&seed=${seed}&enhance=true&mode=relaxed`;
          
          const imgResponse = await axios.get(pollinUrl, { 
            responseType: 'arraybuffer', 
            timeout: 90000,
            maxRedirects: 5,
            headers: { 'Accept': 'image/png,image/jpeg,*/*' }
          });
          
          if (imgResponse.data && imgResponse.data.length > 1000) {
            baseImageBuffer = Buffer.from(imgResponse.data);
            generated = true;
            console.log('Pollinations image generated successfully');
          }
        } catch (pollinError) {
          console.error('Pollinations failed:', pollinError.message);
        }
        
        // Try method 1.5: Use free image generation via API
        if (!generated) {
          try {
            console.log('Trying Free Image Gen API...');
            const freeApiUrl = `https://image.pollinations.ai/v1/prompt?prompt=${encodeURIComponent(variationPrompt)}&width=${Math.min(finalWidth, 768)}&height=${Math.min(finalHeight, 768)}&nologo=true`;
            const freeResponse = await axios.get(freeApiUrl, {
              responseType: 'arraybuffer',
              timeout: 90000
            });
            if (freeResponse.data && freeResponse.data.length > 1000) {
              baseImageBuffer = Buffer.from(freeResponse.data);
              generated = true;
              console.log('Free API image generated');
            }
          } catch (freeError) {
            console.error('Free API failed:', freeError.message);
          }
        }
        
        // Try method 2: Use Hugging Face if Pollinations failed
        if (!generated) {
          try {
            console.log('Trying Hugging Face...');
            const hfResponse = await axios.post(
              'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
              { 
                inputs: variationPrompt,
                parameters: {
                  negative_prompt: negativePrompt,
                  guidance_scale: 7.5,
                  num_inference_steps: 30
                }
              },
              { 
                responseType: 'arraybuffer',
                timeout: 90000,
                headers: { 'Content-Type': 'application/json' }
              }
            );
            baseImageBuffer = Buffer.from(hfResponse.data);
            generated = true;
            console.log('Hugging Face image generated');
          } catch (hfError) {
            console.error('Hugging Face failed:', hfError.message);
          }
        }
        
        // Try method 3: Alternate Pollinations URL format
        if (!generated) {
          try {
            console.log('Trying alternate Pollinations...');
            const altUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(variationPrompt)}?width=${Math.min(finalWidth, 512)}&height=${Math.min(finalHeight, 512)}&nologo=true`;
            const altResponse = await axios.get(altUrl, { 
              responseType: 'arraybuffer', 
              timeout: 60000 
            });
            if (altResponse.data && altResponse.data.length > 1000) {
              baseImageBuffer = Buffer.from(altResponse.data);
              generated = true;
              console.log('Alternate Pollinations worked');
            }
          } catch (altError) {
            console.error('Alternate failed:', altError.message);
          }
        }
        
        // Try method 4: Direct Pollinations without image. prefix
        if (!generated) {
          try {
            console.log('Trying direct Pollinations...');
            const directUrl = `https://pollinations.ai/prompt/${encodeURIComponent(variationPrompt)}?width=${Math.min(finalWidth, 512)}&height=${Math.min(finalHeight, 512)}&nologo=true`;
            const directResponse = await axios.get(directUrl, { 
              responseType: 'arraybuffer', 
              timeout: 60000 
            });
            if (directResponse.data && directResponse.data.length > 1000) {
              baseImageBuffer = Buffer.from(directResponse.data);
              generated = true;
              console.log('Direct Pollinations worked');
            }
          } catch (directError) {
            console.error('Direct Pollinations failed:', directError.message);
          }
        }
        
        // Try method 5: Use anyscale or other free API
        if (!generated) {
          try {
            console.log('Trying alternative free API...');
            // Try using a different free image service
            const altApiUrl = `https://image.pollinations.ai/v1/generate?prompt=${encodeURIComponent(variationPrompt)}&width=${Math.min(finalWidth, 512)}&height=${Math.min(finalHeight, 512)}&seed=${variationSeed || Math.floor(Math.random() * 10000)}`;
            const altApiResponse = await axios.get(altApiUrl, {
              responseType: 'arraybuffer',
              timeout: 60000,
              headers: { 'Accept': 'image/*' }
            });
            if (altApiResponse.data && altApiResponse.data.length > 1000) {
              baseImageBuffer = Buffer.from(altApiResponse.data);
              generated = true;
              console.log('Alternative API worked');
            }
          } catch (altApiError) {
            console.error('Alternative API failed:', altApiError.message);
          }
        }
        
        // Final fallback: Sports-themed random image from Unsplash
        if (!generated) {
          console.error('All AI generation failed, using sports image fallback');
          const sportsImages = [
            'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80',
            'https://images.unsplash.com/photo-1574629810360-7ef0d255b286?w=800&q=80',
            'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80',
            'https://images.unsplash.com/photo-1431324155629-1a6deb8dec8a?w=800&q=80',
            'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
            'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80'
          ];
          const randomImage = sportsImages[Math.floor(Math.random() * sportsImages.length)];
          const fallbackResponse = await axios.get(randomImage, { 
            responseType: 'arraybuffer', 
            timeout: 30000 
          });
          baseImageBuffer = Buffer.from(fallbackResponse.data);
        }
      }
      
      const composites = [];
      
      // Add logo with configurable position and visibility
      if (logo && logo.startsWith('data:image')) {
        const logoData = logo.replace(/^data:image\/\w+;base64,/, '');
        const logoBuffer = Buffer.from(logoData, 'base64');
        const logoMetadata = await sharp(logoBuffer).metadata();
        
        // Logo size: 20% of image width, but min 50px, max 200px
        let logoWidth = Math.round(finalWidth * 0.20);
        logoWidth = Math.max(50, Math.min(logoWidth, 200));
        const logoHeight = Math.round((logoWidth / logoMetadata.width) * logoMetadata.height);
        
        const cornerRadius = Math.round(logoWidth * 0.08);
        
        // Create rounded rectangle mask
        const roundedMask = await sharp({
          create: {
            width: logoWidth,
            height: logoHeight,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          }
        }).composite([{
          input: Buffer.from(`<svg width="${logoWidth}" height="${logoHeight}">
            <rect x="0" y="0" width="${logoWidth}" height="${logoHeight}" rx="${cornerRadius}" ry="${cornerRadius}" fill="white"/>
          </svg>`),
          top: 0,
          left: 0
        }]).png().toBuffer();
        
        const resizedLogo = await sharp(logoBuffer)
          .resize(logoWidth, logoHeight)
          .composite([{
            input: roundedMask,
            blend: 'dest-in'
          }])
          .png()
          .toBuffer();
        
        // No white background - use transparent
        const bgPadding = 0;
        const bgWidth = logoWidth + bgPadding * 2;
        const bgHeight = logoHeight + bgPadding * 2;
        
        // Determine position
        const positionPadding = 20;
        let left, top;
        switch (logoPosition) {
          case 'top-left':
            left = positionPadding;
            top = positionPadding;
            break;
          case 'top-right':
            left = finalWidth - logoWidth - positionPadding;
            top = positionPadding;
            break;
          case 'bottom-left':
            left = positionPadding;
            top = finalHeight - logoHeight - positionPadding;
            break;
          case 'bottom-right':
            left = finalWidth - logoWidth - positionPadding;
            top = finalHeight - logoHeight - positionPadding;
            break;
          default: // top-right
            left = finalWidth - logoWidth - positionPadding;
            top = positionPadding;
        }
        
        // Add logo directly (no background)
        composites.push({
          input: resizedLogo,
          left: left,
          top: top
        });
      }
    // Extract catchy title from prompt - smart headline generation
    function generateCatchyTitle(originalPrompt) {
      let title = originalPrompt
        .replace(/\s+/g, ' ')
        .trim();
      
      // Convert to proper title case
      title = title.replace(/\w+/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
      
      // Keep it professional - max 55 chars
      if (title.length > 55) {
        title = title.substring(0, 52).replace(/\s+\S+$/, '') + '...';
      }
      
      // Add period at end if not already ending with punctuation
      if (!title.endsWith('.') && !title.endsWith('...')) {
        title += '.';
      }
      
      return title || 'SPORTS UPDATE';
    }
    
    const titleText = title || generateCatchyTitle(prompt);
    const titleSize = Math.round(finalWidth * 0.04); // Font size
    const titleBarHeight = Math.round(finalWidth * 0.30); // 30% of image width
    const brandSize = Math.round(finalWidth * 0.016);
    
    function wrapTitleText(text, maxWidth) {
      const words = text.split(' ');
      const lines = [];
      let currentLine = '';
      
      // Use a higher limit for better width utilization
      const maxCharsPerLine = 40;
      
      for (const word of words) {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        if (testLine.length > maxCharsPerLine) {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    }
    
    const wrappedLines = wrapTitleText(titleText, finalWidth * 0.9);
    const lineHeight = titleSize * 1.2;
    const totalTextHeight = wrappedLines.length * lineHeight;
    const textStartY = finalHeight - titleBarHeight + (titleBarHeight - totalTextHeight) / 2 + titleSize * 0.4;
    
    let textLinesSvg = '';
    wrappedLines.forEach((line, i) => {
      textLinesSvg += `<tspan x="${finalWidth/2}" dy="${i === 0 ? 0 : lineHeight}">${line}</tspan>`;
    });
    
    // Professional title styling
    // Adjust text position if logo at bottom to avoid overlap
    let textYOffset = 0;
    if (logoPosition && logoPosition.includes('bottom')) {
      textYOffset = -50; // shift up by 50px
    }
    
    const textSvg = `
      <svg width="${finalWidth}" height="${finalHeight}">
        <defs>
          <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:rgba(0,0,0,0);stop-opacity:0" />
            <stop offset="100%" style="stop-color:rgba(0,0,0,0.85);stop-opacity:1" />
          </linearGradient>
          <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#00ff88" />
            <stop offset="100%" style="stop-color:#58a6ff" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
         <!-- Gradient overlay at bottom -->
         <rect x="0" y="${finalHeight - 140 + textYOffset}" width="${finalWidth}" height="140" fill="url(#barGrad)"/>
         
         <!-- Accent line -->
         <rect x="0" y="${finalHeight - 95 + textYOffset}" width="${finalWidth * 0.4}" height="3" fill="url(#accentGrad)"/>
         
         <!-- Brand Bar Gradient (commented out - using solid green instead) -->
         <!-- 
         <linearGradient id="brandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
           <stop offset="0%" style="stop-color:${BRAND.colors.neutrals.bgDark};stop-opacity:0.6" />
           <stop offset="100%" style="stop-color:${BRAND.colors.neutrals.bgMedium};stop-opacity:0.6" />
         </linearGradient>
         -->
        
        <!-- Enhanced Title Bar with Selected Background Color -->
        <rect x="0" y="${finalHeight - titleBarHeight + textYOffset}" width="${finalWidth}" height="${titleBarHeight}" 
              fill="${TITLE_BAR_COLORS[titleBarColor] || TITLE_BAR_COLORS.dark}" opacity="0.95"/>
        <text x="${finalWidth/2}" y="${textStartY + textYOffset}" 
              font-family="Oswald, Impact, Arial Black, sans-serif" font-size="${titleSize}" 
              fill="${TITLE_BAR_TEXT_COLORS[titleBarTextColor] || TITLE_BAR_TEXT_COLORS.white}" font-weight="bold" letter-spacing="1"
              text-anchor="middle" dominant-baseline="middle">
          ${textLinesSvg}
        </text>
        
        <!-- Enhanced Brand Bar with White Background -->
        <rect x="0" y="${finalHeight - BRAND.image.brandBarHeight + textYOffset}" width="${finalWidth}" height="${BRAND.image.brandBarHeight}" 
              fill="${BRAND.colors.neutrals.textPrimary}" opacity="0.9"/>
        <text x="20" y="${finalHeight - 12 + textYOffset}" 
              font-family="${BRAND.typography.fontStack}" font-size="${brandSize}" 
              fill="${BRAND.colors.neutrals.bgDark}" font-weight="${BRAND.typography.weights.semibold}" letter-spacing="1">
          SPORTS247
        </text>
        <text x="${finalWidth - 20}" y="${finalHeight - 12 + textYOffset}" 
              font-family="${BRAND.typography.fontStack}" font-size="${brandSize}" 
              fill="${BRAND.colors.neutrals.bgDark}" font-weight="${BRAND.typography.weights.bold}" letter-spacing="1" text-anchor="end">
          ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </text>
      </svg>
    `;
    
    composites.push({
      input: Buffer.from(textSvg),
      top: 0,
      left: 0
    });
    
    image = image.composite(composites);
    
    // Convert to PNG
    const pngBuffer = await image.png().toBuffer();
    return `data:image/png;base64,${pngBuffer.toString('base64')}`;
    }

    // Generate images for all variations
    const generatedVariations = [];
    
    // Only generate 1 image if variations is false
    const numToGenerate = variations ? promptVariations.length : 1;
    const variationsToGenerate = promptVariations.slice(0, numToGenerate);
    
    for (let i = 0; i < variationsToGenerate.length; i++) {
      const variation = variationsToGenerate[i];
      try {
        const imageUrl = await generateSingleImage(variation.prompt, variation.seed, variation.name);
        generatedVariations.push({
          imageUrl: imageUrl,
          variation: variation.name,
          enhancedPrompt: variation.prompt
        });
      } catch (varError) {
        console.error(`Failed to generate variation ${variation.name}:`, varError.message);
        // Continue with other variations
      }
    }
    
    // If no variations were generated, return error
    if (generatedVariations.length === 0) {
      throw new Error('Failed to generate any images');
    }
    
    res.json({
      success: true,
      variations: generatedVariations,
      imageUrl: generatedVariations[0].imageUrl, // Primary image for backwards compatibility
      enhancedPrompt: enhancedPrompt,
      negativePrompt: negativePrompt,
      style: style,
      prompt: prompt,
      mode: 'text2image',
      logo: logo || null,
      size: { width: finalWidth, height: finalHeight },
      sizePreset: sizePreset || 'custom'
    });

  } catch (error) {
    console.error('Image generation error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to generate image' });
  }
});

// Serve static files
app.use(express.static('.'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Telegram Webhook endpoint - will be set after bot initializes
let webhookReady = false;

// Graceful shutdown
process.once('SIGINT', () => {
  try { bot.stop('SIGINT'); } catch(e) {}
  process.exit();
});
process.once('SIGTERM', () => {
  try { bot.stop('SIGTERM'); } catch(e) {}
  process.exit();
});

app.listen(PORT, () => {
  console.log(`সার্ভার চলছে: http://localhost:${PORT}`);
  
  // Initialize bot after server starts
  const botModule = initBot();
  bot = botModule.bot;
  startBot = botModule.startBot;
  handleUpdate = botModule.handleUpdate;
  
  // Telegram Webhook endpoint - use Telegraf's express middleware
  app.use('/telegraf', Telegraf.webhookCallback(bot, 'express'));
  
  // Start bot with delay
  setTimeout(() => {
    startBot().then(() => console.log('🤖 Bot started')).catch(() => {});
  }, 3000);
});

// Global error handlers to prevent crash
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.log('Unhandled Rejection:', reason);
});
