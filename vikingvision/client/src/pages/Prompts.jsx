import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Prompts.css';

const CATEGORIES = [
  { id: 'warriors', name: 'Warriors & Battles', icon: '⚔️' },
  { id: 'nature', name: 'Nature & Landscapes', icon: '🏔️' },
  { id: 'village', name: 'Villages & Daily Life', icon: '🏠' },
  { id: 'ships', name: 'Ships & Sea', icon: '⛵' },
  { id: 'festivals', name: 'Festivals & Feasts', icon: '🍖' },
  { id: 'mythology', name: 'Mythology & Gods', icon: '⚡' }
];

const DEFAULT_PROMPTS = {
  warriors: [
    'Viking warriors in full battle armor charging across a snow-covered field at dawn, dramatic orange and pink sky illuminating their shields decorated with intricate knotwork and animal engravings, war axes raised high, battle cries echoing through the cold air, fur cloaks flowing behind them, snow particles swirling around armored boots, cinematic wide shot with shallow depth of field',
    'A legendary berserker warrior standing alone against an approaching army at sunset, mist swirling around their bare feet painted with sacred runes, massive double-headed axe gripped in powerful hands, glowing eyes filled with divine fury, battlefield smoke rising behind, ancient war paint marking their face, dramatic god ray lighting from breaking clouds, cinematic portrait with dramatic perspective',
    'Shield wall formation of Viking warriors defending their fortified village from invading forces, interlocking round shields creating a steel barrier, arrows flying through air in slow motion, some shields bearing clan animal symbols like ravens, wolves and boars, defenders behind ready with spears, morning mist creating ethereal atmosphere, warm torch light from village behind, epic wide establishing shot',
    'Epic sword duel between two legendary Viking fighters in an ancient misty forest, oak trees with spiral carvings in background, fallen autumn leaves caught in the air around them, sparks flying as blades clash, both warriors wearing leather armor with metal rivets, dramatic shadows and light from moon breaking through canopy, cinematic tracking shot circling the fighters, blood dripping from a wound adding intensity',
    'Viking raiders pillaging an enemy coastal village with torches held high, flames rising against the night sky casting dancing shadows, thatched roofs catching fire, villagers fleeing in fear, raiders wearing distinctive warrior braids and beard rings, gold and silver treasures being gathered into cloth bundles, dramatic firelight illuminating their determined faces, seascape in background with their dragon-headed longship anchored, wide cinematic shot',
    'Three Viking javelin throwers in synchronized athletic motion against a stormy sky, dark clouds with lightning flashing in background, athletic muscular bodies in mid-throw action, traditional leather-and-chainmail armor, ancient runic inscriptions on weapon shafts, muddy ground showing footprints of prior battles, dramatic god rays breaking through storm clouds, cinematic action sequence with motion blur',
    'Viking warlord on magnificent warhorse leading his army through a treacherous mountain pass covered in morning fog, heavy chainmail creating metallic shimmers, horned helmet catching first light, commanding arm raised directing troops below, ravens circling overhead as scouts, breath creating mist in cold air, snow-capped peaks towering in background, epic aerial drone shot looking down on the procession, torchbearers creating pockets of warm light',
    'Ancient Viking combat training ground with warriors sparring in a sandy arena at midday, wooden practice weapons swinging in slow motion, instructors demonstrating proper shield techniques, circular training rings with raised earthworks, sweat glistening on athletic bodies, traditional training equipment visible, warm golden sunlight casting long dramatic shadows, birds of prey circling overhead, cinematic wide shot of the entire training ground with mountains in background',
    'Viking archers taking strategic cover behind their distinctive round shields in a river valley, arrows nocked and ready, enemy forces approaching through the water causing splashes, marshland vegetation creating natural camouflage, feathers on arrows fluttering in wind, tactical formation with scouts in trees, fog rising from the water surface, morning light creating misty atmosphere, cinematic medium shot from enemy perspective',
    'Fierce Viking shield maiden fighting alongside male warriors in an epic battlefield charge, flowing braided hair visible beneath her helmet, distinctive feminine armor with decorative engravings, round shield with fierce wolf design leading the charge, both genders fighting as equals, enemies falling back in fear, dramatic firelight from burning village in background, ravens feasting on fallen, cinematic wide battle scene with depth of field focusing on the shield maiden'
  ],
  nature: [
    'Majestic mountain peaks of Norway covered in pristine snow under the northern lights, green and purple aurora dancing poetically across the entire night sky, reflections visible in crystal-clear frozen mountain lake below, ancient pine trees silhouettes against the cosmic display, mystical fog rising from valley floor, no man-made structures, pure wilderness, ultra-detailed photorealistic rendering with cinematic wide composition and subtle star trails',
    'Dense Nordic forest with ancient thousand-year-old pine trees reaching for the sky, misty atmosphere with morning dew glistening on every needle, scattered mushrooms and lingonberry bushes covering forest floor, occasional beams of golden sunlight breaking through dense canopy creating volumetric light rays, distant owl hooting, wolf tracks in soft mud, authentic Scandinavian wilderness untouched by civilization, photorealistic detail with shallow depth of field and warm earthy color palette',
    'Rolling green hills of Iceland with wildflowers in full bloom during the midnight sun, vibrant purple lupines and yellow buttercups creating carpet of colors, golden hour lighting lasting all night, sheep grazing peacefully in foreground with their wool catching the golden light, distant volcanic mountains with snow caps, no fences or boundaries, pure natural landscape, cinematic drone shot sweeping across the pastoral scene with warm color grading',
    'Frozen waterfall in深度winter with massive ice crystals glittering like diamonds, sunlight creating multiple rainbows through the mist, blue and white ice formations creating cathedral-like structures, steam rising where water meets frigid air, no human presence, pure arctic wilderness, dramatic wide shot with ice particles catching light, ultrasonic detail showing every frozen bubble and crystal structure',
    'Misty Norwegian fjord at sunrise with towering mountains in background, perfectly calm water surface creating perfect mirror reflection, ancient wooden longhouse silhouettes on distant shore, morning fog gradually lifting, single raven flying across the scene, seagulls on rocky shores, no modern elements, authentic Norse landscape, epic landscape photography with warm sunrise colors reflected in water, cinematic depth from foreground rocks to distant mountains',
    'Ancient volcanic Icelandic landscape with moss-covered black volcanic rocks and steaming natural hot springs at twilight, otherworldly orange and yellow mineral deposits creating contrast with dark rocks, steam plumes rising into the cool evening air, distant eruption smoke on horizon, geothermal pools with natural mineral colors, no vegetation yet due to recent volcanic activity, moody cinematic shot with dramatic sky and geothermal steam, science fiction meets ancient earth aesthetic',
    'Dramatic cliff coastline with powerful North Atlantic waves crashing against ancient rocks, white foam spray catching the last light of sunset, seagulls nesting on cliff ledges, distinctive cliff formations carved by millennia of waves, no human structures, pure elemental power of nature, wide cinematic shot with long exposure showing motion blur on waves, dramatic orange and pink sunset sky, moody and powerful composition',
    'Dense Scandinavian birch forest in peak autumn with golden and red leaves covering the entire forest floor, morning mist filtering through colorful canopy, occasional ancient oak with spiral rune carvings on bark, wolves glimpsed between trees in background, pure native woodland ecosystem, warm afternoon light filtering through leaves creating dappled patterns, photorealistic detail with soft focus and warm color palette, fairy tale atmosphere',
    'Crystal clear mountain lake of Norway reflecting surrounding snow-capped peaks perfectly at golden hour, still water like a perfect mirror, single wooden皮的 boat on far shore, wild reindeer drinking at water edge, no human presence, ultra-realistic rendering with perfect reflections, cinematic aerial shot looking straight down showing mirror symmetry, warm golden hour lighting, peaceful and spiritual atmosphere',
    'Rolling Siberian tundra with tiny purple and yellow Arctic flowers blooming across the vast平原, distant mammoth steppe mountains under dramatically clouded sky, small herd of wild horses in distance, permafrost ground with intricate crack patterns, no trees or shrubs, pure Arctic wilderness, epic wide establishing shot showing immensity of landscape, dramatic storm clouds building on horizon, cold color palette with pops of flower color'
  ],
  village: [
    'Authentic medieval Viking village with multiple longhouses featuring characteristic sod roofs sprouting grass, smoking chimneys with morning smoke rising, children playing in the village square with wooden toys, faithful dogs running between buildings, fenced animal enclosures with sheep and goats, hand-carved wooden doors and window shutters, warm firelight flickering through open doors, morning mist in the valley, epic wide shot showing entire village with mountains in background',
    'Master blacksmith forging weapons in a smoky forge, orange molten metal glow illuminating the workspace, traditional bellows creating sparks, hammer striking an axe head taking shape, leather apron and arm protection visible, finished weapons hanging on walls, charcoal fire with characteristic blue flames at center, intense heat distortion visible, warm color palette with dramatic lighting from the forge, medium shot focusing on the craftsman hands',
    'Hard-working Viking farmers using wooden plows pulled by oxen in freshly cleared fields, typical Norse rectangular wooden plows turning dark soil, grain storage pits being prepared nearby, simple but functional farm tools visible, small family working together, weathered wooden fences, haystacks ready for winter, distant mountains, warm golden hour lighting, documentary-style shot showing agricultural life, peaceful productive atmosphere',
    'Women weaving traditional Norse textiles in a warm longhouse interior, upright Germanic-style looms with intricate patterns in progress, open fire cooking pots with stew simmering, children sleeping in fur-lined beds, animal furs hanging to cure, warm amber lighting from fire, authentic wooden bowls and utensils, steam and smoke rising through smoke hole in roof, intimate cinematic shot capturing domestic Norse life, warm and cozy atmosphere',
    'Children playing outside a rustic Viking village with wooden toy swords and shields, loyal village dogs running and playing with them, mud-plastered walls of the longhouses in background, vegetable garden patches, well with wooden bucket, open village square packed with straw, traditional wooden playground equipment, happy laughter audible, wide warm shot capturing carefree childhood in Viking age, golden afternoon light',
    'Colorful Viking marketplace with merchants trading exotic goods from distant lands, vibrant dyed textiles and intricate metalwork jewelry displayed on wooden tables, merchants in traditional dress with distinctive brooches and belt buckles, customers examining goods, scale weights for precious metals, carved wooden trading tokens, Roman and Arabic coins changing hands, lively bustling atmosphere, wide cinematic shot showing the commercial heart of the village',
    'Fishing dock with fishermen unloading the morning catch, various traditional Nordic fish visible, nets draped over wooden structures to dry, wooden boats bobbing in harbor, seagulls waiting for scraps, characteristic pointed Viking fishing boat pulled onto shore, fish smokehouses in background, hardworking crews in wool and leather, golden sunrise lighting, medium shot capturing the catch of the day, maritime village life',
    'Village elder telling epic sagas to captivated children gathered around a central fire, animated hand gestures accompanying the story, faces illuminated by firelight showing wonder and fear, shadows dancing on walls behind, traditional wooden bench seating, hanging herbs and dried fish from rafters, warm intimate scene, medium shot focusing on elder\'s animated face and children\'s reactions, storytelling tradition',
    'Village horses drinking from the communal stone well while women draw water in carved wooden buckets, wooden bucket systems visible, horses in their prime with braided manies, women in traditional dress with headscarves, village gossip exchanged, warm afternoon light, classic village scene, medium shot capturing daily chore, peaceful community atmosphere',
    'Traditional wooden watermill grinding grain in peaceful village setting with mountains in background, rushing water wheel turning slowly, millstones crushing grain, flour dust rising, rustic wooden construction with characteristic Norse joinery, grain storage barns nearby, farm animals wandering, golden sunset lighting, wide establishing shot showing the entire mill complex, medieval Norse technology'
  ],
  ships: [
    'Authentic Viking longship sailing through calm seas under a spectacular starlit sky, bioluminescent waves glowing blue-green in the ship\'s wake, dragon-headed prow carving through calm water, intricate wooden carvings visible in moonlight, warriors huddled under wool blankets, shield displayed on side, fur-lined sails catching wind, no modern elements, ultra-detailed cinematic shot, mystical atmosphere with northern lights in distant sky',
    'Classic drakkar warship with magnificent dragon head carving at bow, elaborate knotwork patterns on both sides, warriors in chainmail standing at ready with spears, shield wall along the sides, characteristic square sail with stripe patterns, oars deployed for rowing, dramatic sunrise lighting the scene, seascape with distant fjords, cinematic wide shot showing the warship\'s full grandeur, Viking naval power',
    'Fishing vessels returning to harbor at sunset, nets overflowing with silver fish visible, tired but happy fishermen, traditional Viking fishing boat design with raised sides, seagulls diving for scraps, harbor with wooden docks, smoking fish racks in background, warm golden hour lighting, medium shot capturing the successful catch, maritime village life',
    'Warship with characteristic striped sail raised high approaching distant shore, enemy territory visible on beach, flags flying from mast, warriors ready for battle, dragon prow cutting through moderate waves, no modern elements, dramatic sky with storm clouds building, cinematic aerial shot showing the invasion fleet, Viking exploration and conquest',
    'Brave Viking sailors navigating through massive icebergs in arctic waters, frozen mist creating ethereal atmosphere around the ship, warm fur clad sailors at oars, ice crack sounds audible, characteristic double-ended hull design perfect for ice navigation, expedition supplies secured, dramatic winter seascape, epic wide shot showing tiny ship against massive ice formations, human perseverance',
    'Loaded Viking cargo ship with merchant goods stacked high on deck, displayed trade goods visible - furs, amber, iron ore, woven textiles, characteristic cargo rails, small crew managing the load, narrow straits between rocky shores, no modern elements, dramatic sunset lighting, medium shot showing the weight of commerce, merchant adventures',
    'Hardworking crew rowing a warship through choppy morning waves, spray of salt water caught in early light, powerful arm muscles visible, coordinated rowing in perfect rhythm, bearded warriors with war braids, shield displaying clan symbols, character-driven cinematic shot, collective determination, ancient naval warfare',
    'Characteristic longship with dragon figurehead passing under natural stone arch bridge in a narrow fjord, morning mist rising from water, wool-clad sailors on deck, cargo secured, dramatic rock walls towering above, single torch on the bow, moody cinematic shot with perfect reflections, engineering marvel',
    'Viking expedition ship with explorers on deck gazing at newly discovered land ahead, distant unfamiliar coast visible, flags flying, fur and leather expedition gear, supplies loaded including tools and seeds, hope and determination visible on weathered faces, dramatic sunrise new world discovery, cinematic wide shot showing human courage',
    'Experienced sailors furling large woolen sails as they approach a sheltered bay for night, anchor ready, lanterns being lit, evening meal being prepared, tired but satisfied expressions, calm protected waters, mountainous bay with waterfalls, warm sunset colors, peaceful end to day\'s voyage, cinematic twilight shot'
  ],
  festivals: [
    'Magnificent feast hall with long wooden tables groaning under food, burning torches casting dancing light on walls decorated with shields and weapons, mead horn cups raised in toast, musicians playing traditional Norse instruments - lur horns and frame drums, roast pork and bread abundant, boisterous laughter and storytelling, warm golden firelight throughout, cinematic wide shot showing the entire celebration, community bonding',
    'Traditional Viking wedding ceremony with bride in elaborate braided hair and wedding crown of fresh flowers, groom in formal polished armor with sword at side, wedding party in attendance, ceremonial mead cup exchange, hand-fasting ritual with ribbon, sacred tree altar in background, guests throwing grain for fertility, warm torchlight, intimate medium shot focusing on the couple, love and commitment',
    'Communal drinking circle with large ornate horn cups being passed, elaborate toasts being made to Odin and Thor, laughter and joking between warriors, seated on wooden benches around central fire, traditional drinking horns with gold filigree, spilled mead adding to the festive atmosphere, warm intimate lighting, medium shot capturing the social bonding, friendship and fellowship',
    'Burning Yule log in great hall during winter festival, massive log on the fire, everyone gathered warming themselves, evergreen decorations hanging, winter darkness outside windows, traditional Yule foods being served, Odin\'s ravens watching from shadows, warm and cozy interior contrasting with cold outside, cinematic medium shot focusing on the fire and faces, light in darkness',
    'Competitive village games in the main square, arm wrestling contests with spectators cheering, stone lifting competitions, running races through the village, traditional stick games, winners receiving arm rings as prizes, betting and wagering happening, enthusiastic spectators, warm afternoon light, documentary-style shot capturing the village fun, community spirit',
    'Traditional Viking funeral pyre with ship being burned at sea at night, torches being applied to the hull, smoke rising into starry sky, mourners in attendance, personal belongings being placed on ship, ceremonial verse being recited, waves lapping at the shore, dramatic lighting from the flames, cinematic wide shot capturing the ritual, honoring the dead',
    'Spring planting festival with offerings to the gods placed at the sacred stone altar, grain seeds being blessed, fertility symbols displayed, young green plants emerging through snow, celebratory foods being shared, villagers in their best clothes, robin birds returning, warm spring light, medium shot showing the agricultural ritual, hope for harvest',
    'Midnight sun celebration with massive bonfires on the beach, people dancing in circles around the flames, traditional folk dancing with clasped hands, drums and flutes playing, fish and bread being cooked over fire, swimming in the midnight sea, joy and celebration, warm golden light despite late hour, epic wide shot capturing the summer solstice, nature\'s gift',
    'Harvest festival with abundant displays of vegetables, grains, and fruits, livestock being shown and traded, people examining the best produce, prize-winning animals decorated with ribbons, autumn colors in the landscape behind, warm thanksgiving atmosphere, medium shot showing the agricultural abundance, gratitude and plenty',
    'Ritual dance around ancient standing stones at dawn, mist creating mystical atmosphere, robed figures moving in sacred patterns, fire torches lit, horns sounding in the distance, spiral stone carvings visible, offerings being placed, mystical blue hour light, cinematic wide shot capturing the ancient ritual, spiritual connection'
  ],
  mythology: [
    'All-father Odin with his two ravens Huginn and Muninn watching over the mortal world from between realms, his one eye gleaming with ancient wisdom, his throne from which he sees all nine worlds, ravens reporting to him in real-time, swirling cosmic energy around him, throne room in Valhalla visible through the mist, stars and nebulae in his infinite eyes, cinematic portrait with cosmic depth, divine power and knowledge',
    'Thunder god Thor in full divine splendor holding his mighty hammer Mjolnir against a dramatically dark sky, lightning crackling all around him creating an aura of power, his iron gloves visible, distinctive red beard flowing in the wind, belt of strength around his waist, storm clouds swirling, his chariot pulled by two magical goats in background, cinematic wide shot with lightning illuminating the scene, raw divine power',
    'Descending Valkyries on magnificent winged horses, shining armor reflecting starlight, carrying spears and shields, the ethereal souls of fallen warriors ascending to the light behind them, long flowing battle-plaited hair, feathers on wings catching the wind, dramatic slow-motion descent, cosmic background with stars, cinematic wide shot showing the bridge between mortal and eternal, honor and glory',
    'Ancient rune stones glowing with mystic Norse magic, intricate carvings pulsing with blue energy, symbols of elder Futhark runes lighting up sequentially, mist rising from the ground around them, sacred grove in background, no human presence, supernatural atmosphere, dramatic lighting from the runes themselves, cinematic medium shot, knowledge and power',
    'Massive frost giant Jotun walking through a blizzard in distant mountains, ancient ice-blue skin, crystalline armor reflecting cold light, his breath creating eternal winter, small village visible in his massive footprint for scale, epic wide establishing shot, frozen wilderness of Jotunheim realm, cosmic scale, primal elemental power',
    'Trickster god Loki in the moment of shapeshifting, his form mid-transformation between human and wolf, his characteristic mischievous smile, swirling green energy around him, his eyes showing his true nature despite the disguise, shadows and light playing with his form, cinematic medium shot, chaos and cunning, divine shapeshifter',
    'Yggdrasil the immense world tree connecting all nine realms, its trunk rising from the cosmic sea, roots descending into three wells - Urðr, Mimir, and Hvergelmir, its branches reaching through clouds into Asgard and beyond, tiny realms visible in its branches and roots, mist and swirling cosmic energy, epic wide shot, cosmic interconnectedness of all existence',
    'Norse gods and warriors gathered in grand Valhalla hall, feasting at infinite tables, some engaging in friendly combat in the great hall\'s practice area, shining golden light throughout, Odin\'s throne visible in the distance, endless supply of mead and food, heroic atmosphere, epic wide shot showing the eternal hall, glory eternal',
    'Monstrous wolf Fenrir breaking free from his magical chains with epic fury, broken links flying, massive jaws snapping, glowing red eyes, divine fire emanating from his form, cosmic shockwaves shattering the realm around him, gods reacting in the distance, dramatic cinematic scene, prophecy fulfilled, chaos and destruction',
    'World-serpent Jormungandr rising from between worlds where sky meets sea, massive coils circling the horizon, his distinctive scale pattern catching light, the ocean and clouds merging at his form, thunder and lightning surrounding him, his tail visible in one world while his head is in another, epic cinematic wide shot showing the boundary between realms, Nordic cosmology'
  ]
};

const Prompts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('warriors');
  const [duration, setDuration] = useState(10);
  const [savedPrompts, setSavedPrompts] = useState(() => {
    const saved = localStorage.getItem('vikingPrompts');
    return saved ? JSON.parse(saved) : [];
  });
  const [newPrompt, setNewPrompt] = useState('');
  const [promptTitle, setPromptTitle] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    localStorage.setItem('vikingPrompts', JSON.stringify(savedPrompts));
  }, [savedPrompts]);

  const handleSavePrompt = () => {
    if (!newPrompt.trim() || !promptTitle.trim()) return;
    
    const prompt = {
      id: Date.now(),
      title: promptTitle,
      text: newPrompt,
      category: selectedCategory,
      duration: duration,
      createdAt: new Date().toISOString()
    };
    
    setSavedPrompts([...savedPrompts, prompt]);
    setNewPrompt('');
    setPromptTitle('');
  };

  const handleDeletePrompt = (id) => {
    setSavedPrompts(savedPrompts.filter(p => p.id !== id));
  };

  const handleUsePrompt = (promptText) => {
    navigate(`/generate?prompt=${encodeURIComponent(promptText)}&duration=${duration}`);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="prompts-page">
      <div className="container">
        <div className="prompts-header">
          <h1>Prompt Generator</h1>
          <p>Create and organize your Viking video prompts</p>
        </div>

        <div className="prompts-content">
          <div className="prompts-sidebar">
            <h3>Categories</h3>
            <div className="category-list">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-name">{cat.name}</span>
                </button>
              ))}
            </div>

            <div className="saved-prompts-section">
              <h3>My Saved Prompts</h3>
              {savedPrompts.length === 0 ? (
                <p className="no-prompts">No saved prompts yet</p>
              ) : (
                <div className="saved-list">
                  {savedPrompts.map((prompt) => (
                    <div key={prompt.id} className="saved-prompt-item">
                      <div className="saved-prompt-info">
                        <span className="saved-prompt-title">{prompt.title}</span>
                        <span className="saved-prompt-category">
                          {CATEGORIES.find(c => c.id === prompt.category)?.icon}
                        </span>
                      </div>
                      <div className="saved-prompt-actions">
                        <button 
                          className="btn-small btn-use"
                          onClick={() => handleUsePrompt(prompt.text)}
                        >
                          Use
                        </button>
                        <button 
                          className="btn-small btn-delete"
                          onClick={() => handleDeletePrompt(prompt.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="prompts-main">
            <div className="create-prompt-section">
              <h3>Create New Prompt</h3>
              <div className="create-form">
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Prompt title..."
                    value={promptTitle}
                    onChange={(e) => setPromptTitle(e.target.value)}
                    className="prompt-title-input"
                  />
                  <div className="duration-select">
                    <label>Duration:</label>
                    <select value={duration} onChange={(e) => setDuration(parseInt(e.target.value))}>
                      <option value={5}>5 seconds</option>
                      <option value={10}>10 seconds</option>
                      <option value={15}>15 seconds</option>
                      <option value={20}>20 seconds</option>
                    </select>
                  </div>
                </div>
                <textarea
                  placeholder="Describe your Viking video scene..."
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  rows={4}
                />
                <div className="create-form-footer">
                  <span className="current-category">
                    Category: {CATEGORIES.find(c => c.id === selectedCategory)?.icon} {' '}
                    {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                  </span>
                  <button 
                    className="btn btn-primary"
                    onClick={handleSavePrompt}
                    disabled={!newPrompt.trim() || !promptTitle.trim()}
                  >
                    Save Prompt
                  </button>
                </div>
              </div>
            </div>

            <div className="category-prompts-section">
              <h3>
                {CATEGORIES.find(c => c.id === selectedCategory)?.icon} {' '}
                {CATEGORIES.find(c => c.id === selectedCategory)?.name}
              </h3>
              <div className="prompt-cards">
                {DEFAULT_PROMPTS[selectedCategory].map((prompt, index) => (
                  <div key={index} className="prompt-card">
                    <p className="prompt-text">{prompt}</p>
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => handleUsePrompt(prompt)}
                    >
                      Use This Prompt
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="quick-prompts-section">
              <h3>Quick Start Templates</h3>
              <div className="templates-grid">
                <div className="template-card" onClick={() => { setNewPrompt('A Viking longship sailing through '); setPromptTitle('Ship Template'); setSelectedCategory('ships'); }}>
                  <span className="template-icon">⛵</span>
                  <span className="template-name">Ship Scene</span>
                </div>
                <div className="template-card" onClick={() => { setNewPrompt('Viking warriors in '); setPromptTitle('Battle Template'); setSelectedCategory('warriors'); }}>
                  <span className="template-icon">⚔️</span>
                  <span className="template-name">Battle Scene</span>
                </div>
                <div className="template-card" onClick={() => { setNewPrompt('Viking village with '); setPromptTitle('Village Template'); setSelectedCategory('village'); }}>
                  <span className="template-icon">🏠</span>
                  <span className="template-name">Village Scene</span>
                </div>
                <div className="template-card" onClick={() => { setNewPrompt('Ancient Norse gods like '); setPromptTitle('Mythology Template'); setSelectedCategory('mythology'); }}>
                  <span className="template-icon">⚡</span>
                  <span className="template-name">Mythology</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prompts;