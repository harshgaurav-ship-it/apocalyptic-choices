"use strict";

/* Mumbai: Afterlight — Chapter 1 Build 0.1
   Offline, original browser game. All art and sound are generated locally. */

const $ = (selector) => document.querySelector(selector);
const SAVE_KEY = "mumbai_afterlight_chapter_1_build_01";
const game = $("#game");
const elements = {
  title: $("#titleCard"), resume: $("#resumeButton"), dialogueShell: $("#dialogueShell"),
  dialogue: $("#dialogueText"), speaker: $("#speakerName"), advance: $("#advanceButton"),
  mark: $("#advanceMark"), choiceShell: $("#choiceShell"), choiceGrid: $("#choiceGrid"),
  choicePrompt: $("#choicePrompt"), timerFill: $("#timerFill"), timerReadout: $("#timerReadout"),
  chapter: $("#chapter"), result: $("#resultCard"), resultKicker: $("#resultKicker"),
  resultTitle: $("#resultTitle"), resultText: $("#resultText"), memoryList: $("#memoryList"),
  continue: $("#continueButton"), replay: $("#replayButton"), clearSave: $("#clearSaveButton"),
  settings: $("#settingsPanel"), timerToggle: $("#timerToggle"), soundToggle: $("#soundToggle"), voiceToggle: $("#voiceToggle"),
  harsh: $("#harsh"), kavya: $("#kavya"), leela: $("#leela"), kabir: $("#kabir"), zoya: $("#zoya"), raghav: $("#raghav"), flash: $("#flash"),
  toast: $("#saveToast"), stationTitle: $("#stationTitle"), stationSubtitle: $("#stationSubtitle"),
  explore: $("#exploreShell"), exploreObjective: $("#exploreObjective"), exploreLog: $("#exploreLog"),
  foundItems: $("#foundItems"), exitHall: $("#exitHallButton"), loadout: $("#loadoutShell"),
  loadoutText: $("#loadoutText"), loadoutGrid: $("#loadoutGrid"), loadoutTimer: $("#loadoutTimer"),
  loadoutTimerFill: $("#loadoutTimerFill"), route: $("#routeShell"), routeIntro: $("#routeIntro"),
  routeTimer: $("#routeTimer"), routeTimerFill: $("#routeTimerFill")
  , recap: $("#recapShell"), recapGrid: $("#recapGrid"), recapLead: $("#recapLead"), recapTitle: $("#recapTitleButton")
};

const state = {
  phase: "opening", line: 0, typing: false, fullText: "", timerOn: true, soundOn: false, voiceOn: false,
  timerId: null, typeTimer: null, outcome: null, secondOutcome: null, clues: {}, selectedItem: null, kabirChoice: null, zoyaChoice: null, routeChoice: null, signalChoice: null, gateChoice: null,
  values: { kavyaTrust: 0, kabirTrust: 0, zoyaTrust: 0, raghavTrust: 0, groupSupplies: 0, savedRohan: false, leftLeela: false, keptPromise: false }
};

const openingLines = [
  { speaker: "SYSTEM", text: "DADAR · 8:41 PM · THE NIGHT THE LOCAL STOPPED", shot: "wide", chapter: "THE LAST LOCAL · OPENING" },
  { speaker: "HARSH", text: "Kavya? Don't move. I'm on the platform.", shot: "left", harsh: "neutral", kavya: "worried" },
  { speaker: "KAVYA", text: "I can see you. The doors won't open — and everyone is pushing.", shot: "right", kavya: "worried" },
  { speaker: "HARSH", text: "We take the footbridge. We get out before the next crowd comes in.", shot: "left", harsh: "soft" },
  { speaker: "KAVYA", text: "Harsh... listen.", shot: "right", kavya: "worried" },
  { speaker: "SYSTEM", text: "Somewhere inside the stalled train, a child is crying.", shot: "middle", leela: true, flash: true },
  { speaker: "LEELA", text: "Please! My son is in Coach 4. The lock's jammed. I can't get to him!", shot: "middle", leela: true, kavya: "worried" },
  { speaker: "KAVYA", text: "The announcement said the power could surge again. I don't want to lose you here.", shot: "right", leela: true, kavya: "worried" },
  { speaker: "HARSH", text: "I know.", shot: "left", leela: true, harsh: "worried", beforeChoice: true }
];

const openingChoices = [
  { key: "1", title: "STAY WITH KAVYA", detail: "Keep your promise. Leave before the platform changes.", outcome: "stay" },
  { key: "2", title: "HELP THE BOY", detail: "Ask Kavya to hold the door. Risk the surge.", outcome: "help" },
  { key: "3", title: "ASK KAVYA TO LEAD", detail: "Send her toward safety while you help Leela.", outcome: "split" }
];

const firstResults = {
  stay: {
    title: "TOGETHER, FOR NOW", kicker: "CHECKPOINT SAVED · KAVYA WILL REMEMBER THIS",
    text: "Harsh takes Kavya's hand and leads her through the footbridge. Behind them, the crying fades beneath the station siren. They are alive — but neither of them says they made the right choice.",
    memories: ["KAVYA TRUST +2", "ROHAN WAS LEFT IN COACH 4", "YOU KEPT YOUR PROMISE"],
    lines: [
      { speaker: "KAVYA", text: "You came back for me.", shot: "right", kavya: "soft" },
      { speaker: "HARSH", text: "I said I would.", shot: "left", harsh: "soft" },
      { speaker: "SYSTEM", text: "The last local hums behind them. A child calls once more. Then the lights go out.", shot: "wide" }
    ]
  },
  help: {
    title: "THE SOUND OF ONE MORE BREATH", kicker: "CHECKPOINT SAVED · KAVYA WILL REMEMBER THIS",
    text: "Harsh forces the door open in time for Rohan to crawl through. Kavya never stopped holding the release, even after the current burned her hand. They saved a stranger — and discovered the cost of asking each other to be brave.",
    memories: ["ROHAN SURVIVED", "KAVYA TRUST -1", "KAVYA HELD THE DOOR"],
    lines: [
      { speaker: "KAVYA", text: "My hand is fine. Don't look at it like that.", shot: "right", kavya: "angry" },
      { speaker: "HARSH", text: "You didn't have to stay.", shot: "left", harsh: "worried" },
      { speaker: "KAVYA", text: "Neither did you.", shot: "right", kavya: "soft" },
      { speaker: "SYSTEM", text: "Rohan holds his mother's wrist. In the broken reflection of the train window, three people look back.", shot: "wide" }
    ]
  },
  split: {
    title: "A FAULT LINE", kicker: "CHECKPOINT SAVED · KAVYA WILL REMEMBER THIS",
    text: "Kavya leads Leela toward the bridge while Harsh turns back. He frees Rohan before the surge, but the crowd divides them. The only proof they are still together is the pulse of a phone that will not connect.",
    memories: ["ROHAN SURVIVED", "KAVYA IS ALONE IN THE CROWD", "YOU CHOSE THE UNKNOWN"],
    lines: [
      { speaker: "KAVYA", text: "Meet me at the old ticket office. Don't be late.", shot: "right", kavya: "worried" },
      { speaker: "HARSH", text: "I won't be.", shot: "left", harsh: "soft" },
      { speaker: "SYSTEM", text: "The crowd closes between them. For the first time tonight, Harsh cannot see Kavya.", shot: "wide" }
    ]
  }
};

const footbridgeLines = {
  stay: [
    { speaker: "SYSTEM", text: "FOOTBRIDGE · 8:47 PM · THE FLOOR SHAKES WITH EVERY STEP", shot: "wide", chapter: "THE FOOTBRIDGE · CHECKPOINT 02" },
    { speaker: "KAVYA", text: "Don't turn around. If you do, we won't leave.", shot: "right", kavya: "worried" },
    { speaker: "HARSH", text: "I'm not asking you to forgive me. Just stay close.", shot: "left", harsh: "soft" },
    { speaker: "SYSTEM", text: "At the far landing, an emergency beacon paints the water gold. A maintenance stair vanishes below it.", shot: "middle" },
    { speaker: "KAVYA", text: "Whatever we do next, we do it together.", shot: "right", kavya: "soft", beforeChoice: true }
  ],
  help: [
    { speaker: "SYSTEM", text: "FOOTBRIDGE · 8:47 PM · THE FLOOR SHAKES WITH EVERY STEP", shot: "wide", chapter: "THE FOOTBRIDGE · CHECKPOINT 02" },
    { speaker: "KAVYA", text: "Rohan's with his mother. We did what we could.", shot: "right", kavya: "worried" },
    { speaker: "HARSH", text: "Your hand is still shaking.", shot: "left", harsh: "worried" },
    { speaker: "KAVYA", text: "Then don't make me use it for nothing.", shot: "right", kavya: "angry" },
    { speaker: "SYSTEM", text: "At the far landing, an emergency beacon paints the water gold. A maintenance stair vanishes below it.", shot: "middle", beforeChoice: true }
  ],
  split: [
    { speaker: "SYSTEM", text: "FOOTBRIDGE · 8:47 PM · THE FLOOR SHAKES WITH EVERY STEP", shot: "wide", chapter: "THE FOOTBRIDGE · CHECKPOINT 02" },
    { speaker: "HARSH", text: "Kavya? Answer me.", shot: "left", harsh: "worried" },
    { speaker: "KAVYA", text: "I'm here. Ticket office side. I can see the beacon.", shot: "right", kavya: "worried" },
    { speaker: "SYSTEM", text: "Her voice is thin through the storm. Between them, an emergency beacon paints the water gold.", shot: "middle" },
    { speaker: "KAVYA", text: "Choose a way down. Then find me.", shot: "right", kavya: "soft", beforeChoice: true }
  ]
};

const footbridgeChoices = [
  { key: "1", title: "TAKE THE LIT RAMP", detail: "A visible route. You may have to abandon Harsh's bag.", outcome: "ramp" },
  { key: "2", title: "USE THE MAINTENANCE STAIR", detail: "A dark shortcut. It might hold supplies — or worse.", outcome: "stairs" },
  { key: "3", title: "HOLD THE BRIDGE", detail: "Help a stranded stranger cross before the crowd breaks loose.", outcome: "hold" }
];

const underpassChoices = [
  { key: "1", title: "TELL KABIR THE TRUTH", detail: "Tell him about Rohan, Leela, and what the station took.", outcome: "truth" },
  { key: "2", title: "KEEP IT SMALL", detail: "Give him only enough to keep everyone moving.", outcome: "small" },
  { key: "3", title: "ASK ABOUT A SIGNAL", detail: "Change the subject. Find a route before feelings catch up.", outcome: "signal" }
];

const kabirResultLines = {
  truth: [
    { speaker: "KABIR", text: "Fine. You don't have to make it sound clean. You showed up — that's more than most people did tonight.", shot: "middle", kabir: true, harsh: "worried" },
    { speaker: "KAVYA", text: "We need someone who hears the whole story.", shot: "right", kabir: true, kavya: "soft" }
  ],
  small: [
    { speaker: "KABIR", text: "You skipped the part where you were scared.", shot: "middle", kabir: true, harsh: "worried" },
    { speaker: "HARSH", text: "We don't have time for every part.", shot: "left", kabir: true, harsh: "angry" }
  ],
  signal: [
    { speaker: "KABIR", text: "Still trying to outrun the hard bit, huh? The phones are dead. The hard bit is not.", shot: "middle", kabir: true, harsh: "worried" },
    { speaker: "KAVYA", text: "Then we stop running in circles.", shot: "right", kabir: true, kavya: "soft" }
  ]
};

function underpassLines() {
  const arrival = state.outcome === "stay"
    ? "DADAR EAST UNDERPASS · 9:08 PM · HARSH AND KAVYA WALK OUT OF THE RAIN TOGETHER."
    : state.outcome === "help"
      ? "DADAR EAST UNDERPASS · 9:08 PM · KAVYA'S BURNED HAND IS THE FIRST THING KABIR SEES."
      : "DADAR EAST UNDERPASS · 9:08 PM · HARSH REACHES THE LIGHT ALONE. KAVYA'S VOICE IS SOMEWHERE BEHIND HIM.";
  const harshReply = state.outcome === "split" ? "Kavya's close. I think. I just need a minute." : "We got out. That doesn't mean we're okay.";
  const lines = [
    { speaker: "SYSTEM", text: arrival, shot: "wide", chapter: "THE UNDERPASS · A NEW WITNESS", kabir: true },
    { speaker: "KABIR", text: "Harsh? I thought you were still inside. The city is calling every route closed.", shot: "middle", kabir: true, harsh: "worried" },
    { speaker: "HARSH", text: harshReply, shot: "left", kabir: true, harsh: "worried" }
  ];
  if (state.outcome !== "split") lines.push({ speaker: "KAVYA", text: "Kabir, please. Tell us you saw another way out.", shot: "right", kabir: true, kavya: "worried" });
  lines.push({ speaker: "KABIR", text: "Maybe. But first, tell me what happened in there.", shot: "middle", kabir: true, harsh: "neutral", beforeChoice: true });
  return lines;
}

const dispensaryChoices = [
  { key: "1", title: "SHARE THE ITEM", detail: "Let Zoya turn it into a chance for everyone here.", outcome: "share" },
  { key: "2", title: "KEEP IT FOR KAVYA", detail: "Protect the person Harsh promised to get home.", outcome: "keep" },
  { key: "3", title: "LET ZOYA DECIDE", detail: "Give the call to the person who understands the cost.", outcome: "defer" }
];

const zoyaResultLines = {
  share: [
    { speaker: "ZOYA", text: "All right. Then it belongs to the room, not to me. That means we make it count.", shot: "middle", zoya: true, zoyaExpression: "soft" },
    { speaker: "KAVYA", text: "We'll find another way to take care of each other.", shot: "right", zoya: true, kavya: "soft" }
  ],
  keep: [
    { speaker: "ZOYA", text: "I understand. I don't have to like it.", shot: "middle", zoya: true, zoyaExpression: "worried" },
    { speaker: "KAVYA", text: "Harsh... you don't have to keep proving it.", shot: "right", zoya: true, kavya: "worried" }
  ],
  defer: [
    { speaker: "ZOYA", text: "Then I won't waste it. But don't hand me a decision you won't help carry.", shot: "middle", zoya: true, zoyaExpression: "soft" },
    { speaker: "KABIR", text: "Sounds like a fair deal. First one we've had all night.", shot: "left", zoya: true, kabir: true, kabirExpression: "soft" }
  ]
};

const signalChoices = [
  { key: "1", title: "ANSWER THE VOICE", detail: "Let whoever is out there know the dispensary is still alive.", outcome: "answer" },
  { key: "2", title: "KEEP THE RADIO DARK", detail: "Protect Kavya and the room from an unknown listener.", outcome: "quiet" },
  { key: "3", title: "SEND A FALSE ROUTE", detail: "Draw danger away — and lie to someone who may need help.", outcome: "decoy" }
];

function signalLines() {
  const routeArrival = {
    market: "MARKET STREET · 10:18 PM · THE RADIO FINDS THEM BETWEEN SHUTTERED STALLS.",
    drain: "STORM DRAIN · 10:18 PM · A VOICE LEAKS THROUGH THE WATER AND STATIC.",
    bridge: "THE FLYOVER · 10:18 PM · THE EMERGENCY REPEATER BLINKS ABOVE THE EMPTY LANES."
  }[state.routeChoice];
  const routeReply = {
    market: "There are people in there. If we answer, they may come to us before we can move.",
    drain: "The pipe carries sound farther than it should. If we answer, everyone below will hear it.",
    bridge: "That light is a promise to anyone watching. We decide what it promises."
  }[state.routeChoice];
  return [
    { speaker: "SYSTEM", text: routeArrival, shot: "wide", chapter: "NO SIGNAL · THE REPEATER", zoya: true, kabir: true },
    { speaker: "ZOYA", text: "This is an emergency band. It should be dead. Instead, someone is asking for a room with light.", shot: "middle", zoya: true, kabir: true, zoyaExpression: "worried" },
    { speaker: "KAVYA", text: routeReply, shot: "right", zoya: true, kabir: true, kavya: "worried" },
    { speaker: "KABIR", text: "Every answer is an invitation. Every silence is one too.", shot: "left", zoya: true, kabir: true, kabirExpression: "soft", beforeChoice: true }
  ];
}

const signalResultLines = {
  answer: [
    { speaker: "HARSH", text: "Dadar community dispensary. We have light for now. If you can hear me, say your name.", shot: "left", zoya: true, kabir: true, harsh: "soft" },
    { speaker: "SYSTEM", text: "For three seconds, there is only rain. Then a stranger says: 'We are coming from the west.'", shot: "wide", zoya: true, kabir: true }
  ],
  quiet: [
    { speaker: "HARSH", text: "We don't know who that is. We don't give them a map to Kavya.", shot: "left", zoya: true, kabir: true, harsh: "worried" },
    { speaker: "KAVYA", text: "Thank you. I hate that I needed to hear that.", shot: "right", zoya: true, kabir: true, kavya: "soft" }
  ],
  decoy: [
    { speaker: "HARSH", text: "Tell them the generator is still running at the old cinema. Make it sound real.", shot: "left", zoya: true, kabir: true, harsh: "angry" },
    { speaker: "ZOYA", text: "It will sound real to someone who is scared. That is the part you own.", shot: "middle", zoya: true, kabir: true, zoyaExpression: "angry" }
  ]
};

const gateChoices = [
  { key: "1", title: "OPEN THE GATE", detail: "Let Raghav and the injured stranger into the light now.", outcome: "open" },
  { key: "2", title: "MAKE HIM PROVE IT", detail: "Keep the gate shut until Raghav answers something only Kabir knows.", outcome: "verify" },
  { key: "3", title: "LEAVE IT SEALED", detail: "Protect the room. Let the stranger find another light.", outcome: "seal" }
];

function gateLines() {
  const radioEcho = {
    answer: "The voice from the radio has found the service annex. This time it has a name.",
    quiet: "Someone found the service annex without a radio answer. That is somehow worse.",
    decoy: "The false route did not keep every stranger away. A knock comes from the gate anyway."
  }[state.signalChoice];
  return [
    { speaker: "SYSTEM", text: `SERVICE GATE · 10:31 PM · ${radioEcho}`, shot: "wide", chapter: "NO SIGNAL · THE SERVICE GATE", kabir: true, zoya: true, raghav: true },
    { speaker: "RAGHAV", text: "Raghav Desai. I was with station control. We have one injured kid and nowhere dry left to take him.", shot: "middle", kabir: true, zoya: true, raghav: true, raghavExpression: "worried" },
    { speaker: "KABIR", text: "Station control closed before nine. If you were there, tell us the code word for Platform 3.", shot: "left", kabir: true, zoya: true, raghav: true, kabirExpression: "angry" },
    { speaker: "RAGHAV", text: "Afterlight. It was written on every emergency board when the grid started falling. Please — decide fast.", shot: "middle", kabir: true, zoya: true, raghav: true, raghavExpression: "worried", beforeChoice: true }
  ];
}

const gateResultLines = {
  open: [
    { speaker: "HARSH", text: "Open it. We don't get to call ourselves safe by making a child stay outside.", shot: "left", zoya: true, kabir: true, raghav: true, harsh: "soft" },
    { speaker: "RAGHAV", text: "Then I owe you the truth about what station control heard before it went dark.", shot: "middle", zoya: true, kabir: true, raghav: true, raghavExpression: "soft" }
  ],
  verify: [
    { speaker: "HARSH", text: "You get one question right, then the gate opens. Kabir's question. No shortcuts.", shot: "left", zoya: true, kabir: true, raghav: true, harsh: "worried" },
    { speaker: "RAGHAV", text: "Platform 3. Afterlight. Now please let the kid in before the rain makes the decision for us.", shot: "middle", zoya: true, kabir: true, raghav: true, raghavExpression: "soft" }
  ],
  seal: [
    { speaker: "HARSH", text: "I'm sorry. We cannot open this gate for someone we don't know.", shot: "left", zoya: true, kabir: true, raghav: true, harsh: "worried" },
    { speaker: "RAGHAV", text: "Then remember there was a kid here. That's all I can ask from the other side of a door.", shot: "middle", zoya: true, kabir: true, raghav: true, raghavExpression: "worried" }
  ]
};

function dispensaryLines() {
  const carried = loadoutOutcome(state.selectedItem).item.toLowerCase();
  const arrival = state.outcome === "split"
    ? "DADAR COMMUNITY DISPENSARY · 9:23 PM · KAVYA FINDS THEM THROUGH THE BACK DOOR."
    : "DADAR COMMUNITY DISPENSARY · 9:23 PM · A GENERATOR IS KEEPING ONE ROOM ALIVE.";
  return [
    { speaker: "SYSTEM", text: arrival, shot: "wide", chapter: "NO SIGNAL · THE DISPENSARY", zoya: true, kabir: true },
    { speaker: "ZOYA", text: "Stop there. If you can stand, you can listen. If you can't, sit on the floor and don't lie about it.", shot: "middle", zoya: true, zoyaExpression: "angry" },
    { speaker: "KABIR", text: "This is Zoya. She's the reason this place still has light.", shot: "left", zoya: true, kabir: true, kabirExpression: "soft" },
    { speaker: "ZOYA", text: `Kabir says you crossed the station with a ${carried}. Whatever it is, it may be the only useful thing we have before dawn.`, shot: "middle", zoya: true, zoyaExpression: "worried" },
    { speaker: "KAVYA", text: "There are people behind that curtain. And we don't know who gets hurt next.", shot: "right", zoya: true, kavya: "worried" },
    { speaker: "ZOYA", text: "So decide what it is for: the group, the person you came here with, or my judgment.", shot: "middle", zoya: true, zoyaExpression: "neutral", beforeChoice: true }
  ];
}

function buildRain() {
  const rain = $("#rain");
  for (let index = 0; index < 106; index += 1) {
    const drop = document.createElement("i");
    drop.className = "drop";
    drop.style.left = `${(index * 37) % 101}%`;
    drop.style.setProperty("--len", `${8 + (index % 18)}px`);
    drop.style.setProperty("--dur", `${.56 + (index % 11) / 17}s`);
    drop.style.setProperty("--delay", `${-(index % 19) / 8}s`);
    rain.appendChild(drop);
  }
}

function setExpression(el, expression) {
  el.classList.remove("expression-neutral", "expression-worried", "expression-soft", "expression-angry", "expression-panicked");
  el.classList.add(`expression-${expression || "neutral"}`);
}

function setShot(shot) {
  game.classList.remove("shot-wide", "shot-close-left", "shot-close-right", "shot-middle");
  game.classList.add(shot === "left" ? "shot-close-left" : shot === "right" ? "shot-close-right" : shot === "middle" ? "shot-middle" : "shot-wide");
}

function audioContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  if (!window.afterlightAudio) window.afterlightAudio = new AudioContext();
  const ctx = window.afterlightAudio;
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function setAmbience() {
  if (!state.soundOn) return;
  const ctx = audioContext();
  if (!ctx) return;
  if (!window.afterlightAmbience) {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) data[index] = (Math.random() * 2 - 1) * .22;
    const rain = ctx.createBufferSource(); const filter = ctx.createBiquadFilter(); const gain = ctx.createGain();
    rain.buffer = buffer; rain.loop = true; filter.type = "lowpass"; filter.frequency.value = 1450; gain.gain.value = .035;
    rain.connect(filter).connect(gain).connect(ctx.destination); rain.start();
    window.afterlightAmbience = { rain, filter, gain };
  }
  const ambience = window.afterlightAmbience;
  const quietRoom = ["dispensary", "signal", "gate", "recap"].includes(state.phase);
  ambience.filter.frequency.setTargetAtTime(quietRoom ? 900 : 1450, ctx.currentTime, .18);
  ambience.gain.gain.setTargetAtTime(quietRoom ? .017 : .035, ctx.currentTime, .18);
}

function stopAmbience() {
  const ambience = window.afterlightAmbience;
  const ctx = window.afterlightAudio;
  if (!ambience || !ctx) return;
  ambience.gain.gain.setTargetAtTime(.0001, ctx.currentTime, .08);
  window.setTimeout(() => { try { ambience.rain.stop(); } catch (_) { /* Already stopped. */ } window.afterlightAmbience = null; }, 180);
}

function sound(type) {
  if (!state.soundOn) return;
  const ctx = audioContext();
  if (!ctx) return;
  const oscillator = ctx.createOscillator(); const gain = ctx.createGain();
  const urgent = type === "choice";
  oscillator.type = urgent ? "triangle" : "sine";
  oscillator.frequency.setValueAtTime(urgent ? 276 : 135, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(urgent ? 420 : 101, ctx.currentTime + (urgent ? .16 : .22));
  gain.gain.setValueAtTime(.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(urgent ? .055 : .022, ctx.currentTime + .015);
  gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + (urgent ? .23 : .3));
  oscillator.connect(gain).connect(ctx.destination); oscillator.start(); oscillator.stop(ctx.currentTime + .32);
}

function speakLine(speaker, text) {
  if (!state.voiceOn || !window.speechSynthesis || speaker === "SYSTEM") return;
  window.speechSynthesis.cancel();
  const profiles = {
    HARSH: { rate: .91, pitch: .86 }, KAVYA: { rate: 1.02, pitch: 1.12 }, KABIR: { rate: .89, pitch: .8 },
    ZOYA: { rate: .95, pitch: 1.02 }, RAGHAV: { rate: .88, pitch: .76 }, LEELA: { rate: .98, pitch: 1.1 }
  };
  const profile = profiles[speaker] || { rate: .94, pitch: 1 };
  const line = new SpeechSynthesisUtterance(text); line.lang = "en-IN"; line.rate = profile.rate; line.pitch = profile.pitch;
  window.speechSynthesis.speak(line);
}

function updatePresentation(line) {
  setShot(line.shot || "wide");
  if (line.chapter) elements.chapter.textContent = line.chapter;
  setExpression(elements.harsh, line.harsh || "neutral");
  setExpression(elements.kavya, line.kavya || "worried");
  elements.leela.classList.toggle("hidden", !line.leela);
  elements.kabir.classList.toggle("hidden", !line.kabir);
  elements.zoya.classList.toggle("hidden", !line.zoya);
  elements.raghav.classList.toggle("hidden", !line.raghav);
  setExpression(elements.kabir, line.kabirExpression || "neutral");
  setExpression(elements.zoya, line.zoyaExpression || "neutral");
  setExpression(elements.raghav, line.raghavExpression || "neutral");
  if (line.flash) { elements.flash.classList.remove("active"); void elements.flash.offsetWidth; elements.flash.classList.add("active"); }
}

function typeText(text) {
  state.typing = true; state.fullText = text; elements.dialogue.textContent = ""; elements.mark.classList.remove("ready");
  let index = 0; const speed = Math.max(11, Math.min(23, 410 / text.length));
  const timer = window.setInterval(() => {
    elements.dialogue.textContent += text[index] || ""; index += 1;
    if (index >= text.length) { window.clearInterval(timer); state.typing = false; elements.mark.classList.add("ready"); }
  }, speed);
  state.typeTimer = timer;
}

function showLine(line) {
  updatePresentation(line); elements.speaker.textContent = line.speaker; typeText(line.text); setAmbience(); sound("line"); speakLine(line.speaker, line.text);
}

function activeLines() {
  if (state.phase === "opening") return openingLines;
  if (state.phase === "outcome") return firstResults[state.outcome].lines;
  if (state.phase === "footbridge") return footbridgeLines[state.outcome];
  if (state.phase === "underpass") return underpassLines();
  if (state.phase === "kabir-result") return kabirResultLines[state.kabirChoice];
  if (state.phase === "dispensary") return dispensaryLines();
  if (state.phase === "zoya-result") return zoyaResultLines[state.zoyaChoice];
  if (state.phase === "signal") return signalLines();
  if (state.phase === "signal-result") return signalResultLines[state.signalChoice];
  if (state.phase === "gate") return gateLines();
  if (state.phase === "gate-result") return gateResultLines[state.gateChoice];
  return [];
}

function nextLine() {
  if (state.typing) { window.clearInterval(state.typeTimer); elements.dialogue.textContent = state.fullText; state.typing = false; elements.mark.classList.add("ready"); return; }
  const current = activeLines()[state.line];
  if (current?.beforeChoice) {
    if (state.phase === "opening") showChoices(openingChoices, "WHAT DO YOU DO?", chooseFirst, 30000, "stay");
    if (state.phase === "footbridge") showChoices(footbridgeChoices, "HOW DO YOU LEAVE THE STATION?", chooseSecond, 30000, "ramp");
    if (state.phase === "underpass") showChoices(underpassChoices, "WHAT DO YOU TELL KABIR?", chooseKabir, 30000, "small");
    if (state.phase === "dispensary") showChoices(dispensaryChoices, "WHAT DO YOU DO WITH THE ITEM?", chooseZoya, 30000, "defer");
    if (state.phase === "signal") showChoices(signalChoices, "WHAT DO YOU SEND INTO THE NIGHT?", chooseSignal, 30000, "quiet");
    if (state.phase === "gate") showChoices(gateChoices, "WHAT DO YOU DO WITH THE GATE?", chooseGate, 30000, "verify");
    return;
  }
  state.line += 1;
  const next = activeLines()[state.line];
  if (next) { showLine(next); return; }
  if (state.phase === "outcome") showFirstResult();
  if (state.phase === "kabir-result") showEpisodeResult();
  if (state.phase === "zoya-result") showDispensaryResult();
  if (state.phase === "signal-result") showSignalResult();
  if (state.phase === "gate-result") showGateResult();
}

function showChoices(choices, prompt, onChoose, duration, fallback) {
  elements.dialogueShell.classList.add("hidden"); elements.choiceShell.classList.remove("hidden"); game.classList.add("choice-mode");
  elements.choicePrompt.textContent = prompt; elements.choiceGrid.innerHTML = ""; state.currentChoices = choices;
  choices.forEach((choice) => {
    const button = document.createElement("button"); button.className = "choice"; button.dataset.outcome = choice.outcome;
    button.innerHTML = `<span class="choice-key">${choice.key}</span><strong>${choice.title}</strong><small>${choice.detail}</small>`;
    button.addEventListener("click", () => onChoose(choice.outcome)); elements.choiceGrid.appendChild(button);
  });
  sound("choice");
  if (state.timerOn) startTimer(duration, () => onChoose(fallback, true));
  else { elements.timerReadout.textContent = "∞"; elements.timerFill.style.width = "100%"; elements.timerFill.style.background = "#efa946"; }
}

function startTimer(duration, onTimeout) {
  const started = performance.now();
  const tick = (now) => {
    const remaining = Math.max(0, duration - (now - started)); const percentage = remaining / duration;
    elements.timerFill.style.width = `${percentage * 100}%`; elements.timerFill.style.background = percentage < .3 ? "#db4c53" : "#efa946";
    elements.timerReadout.textContent = Math.ceil(remaining / 1000);
    if (remaining <= 0) { onTimeout(); return; }
    state.timerId = requestAnimationFrame(tick);
  };
  state.timerId = requestAnimationFrame(tick);
}

function closeChoice() {
  if (state.timerId) cancelAnimationFrame(state.timerId);
  state.timerId = null; elements.choiceShell.classList.add("hidden"); game.classList.remove("choice-mode");
}

function chooseFirst(outcome, timedOut = false) {
  closeChoice(); state.outcome = outcome; state.secondOutcome = null; state.phase = "outcome";
  state.values.keptPromise = outcome === "stay"; state.values.savedRohan = outcome !== "stay"; state.values.leftLeela = outcome === "stay";
  state.values.kavyaTrust = outcome === "stay" ? 2 : outcome === "help" ? -1 : 0;
  saveCheckpoint(); elements.dialogueShell.classList.remove("hidden"); state.line = 0;
  elements.chapter.textContent = timedOut ? "A SILENCE BECOMES A CHOICE" : "CHOICE REMEMBERED"; showLine(activeLines()[0]);
}

function chooseSecond(outcome, timedOut = false) {
  closeChoice(); state.secondOutcome = outcome; state.phase = "second-result"; saveCheckpoint();
  elements.chapter.textContent = timedOut ? "THE STORM CHOSE FOR YOU" : "SECOND CHOICE REMEMBERED"; showSecondResult();
}

function chooseKabir(outcome, timedOut = false) {
  closeChoice(); state.kabirChoice = outcome; state.phase = "kabir-result";
  state.values.kabirTrust = outcome === "truth" ? 2 : outcome === "signal" ? -1 : 0;
  saveCheckpoint(); elements.dialogueShell.classList.remove("hidden"); state.line = 0;
  elements.chapter.textContent = timedOut ? "SILENCE ANSWERED FOR YOU" : "KABIR WILL REMEMBER THIS"; showLine(activeLines()[0]);
}

function chooseZoya(outcome, timedOut = false) {
  closeChoice(); state.zoyaChoice = outcome; state.phase = "zoya-result";
  state.values.zoyaTrust = outcome === "share" ? 2 : outcome === "defer" ? 1 : -1;
  state.values.groupSupplies = outcome === "share" ? 2 : outcome === "defer" ? 1 : 0;
  if (outcome === "keep") state.values.kavyaTrust += 1;
  saveCheckpoint(); elements.dialogueShell.classList.remove("hidden"); state.line = 0;
  elements.chapter.textContent = timedOut ? "THE ROOM WAITED TOO LONG" : "ZOYA WILL REMEMBER THIS"; showLine(activeLines()[0]);
}

function chooseSignal(outcome, timedOut = false) {
  closeChoice(); state.signalChoice = outcome; state.phase = "signal-result";
  if (outcome === "answer") { state.values.zoyaTrust += 1; state.values.groupSupplies += 1; }
  if (outcome === "quiet") state.values.kavyaTrust += 1;
  if (outcome === "decoy") state.values.kabirTrust -= 1;
  saveCheckpoint(); elements.dialogueShell.classList.remove("hidden"); state.line = 0;
  elements.chapter.textContent = timedOut ? "THE STATIC CHOSE FOR YOU" : "THE NIGHT HEARD YOU"; showLine(activeLines()[0]);
}

function chooseGate(outcome, timedOut = false) {
  closeChoice(); state.gateChoice = outcome; state.phase = "gate-result";
  if (outcome === "open") { state.values.raghavTrust += 2; state.values.zoyaTrust += 1; state.values.groupSupplies = Math.max(0, state.values.groupSupplies - 1); }
  if (outcome === "verify") state.values.raghavTrust += 1;
  if (outcome === "seal") { state.values.raghavTrust -= 1; state.values.kavyaTrust += 1; state.values.zoyaTrust -= 1; }
  saveCheckpoint(); elements.dialogueShell.classList.remove("hidden"); state.line = 0;
  elements.chapter.textContent = timedOut ? "THE GATE STAYED QUIET" : "THE GATE REMEMBERS"; showLine(activeLines()[0]);
}

function showFirstResult() {
  elements.dialogueShell.classList.add("hidden"); game.classList.add("end-mode");
  const result = firstResults[state.outcome];
  elements.resultKicker.textContent = result.kicker; elements.resultTitle.textContent = result.title; elements.resultText.textContent = result.text;
  elements.memoryList.innerHTML = result.memories.map((memory) => `<span class="memory">${memory}</span>`).join("");
  elements.continue.classList.remove("hidden"); elements.replay.classList.remove("hidden"); elements.replay.innerHTML = "PLAY ANOTHER PATH <span>↻</span>"; elements.clearSave.classList.add("hidden");
  elements.result.classList.remove("hidden"); elements.chapter.textContent = "CHECKPOINT 01 COMPLETE";
}

function finalResult() {
  const tool = loadoutOutcome(state.selectedItem);
  const firstMemory = firstResults[state.outcome].memories[0];
  const relationship = state.outcome === "stay" ? "Kavya's hand stays locked around Harsh's." : state.outcome === "help" ? "Kavya hides her burned hand inside her sleeve." : "Kavya's voice leads Harsh through the rain, somewhere ahead.";
  const clues = Object.values(state.clues).filter(Boolean);
  const clueSummary = clues.length ? `You carry ${clues.join(" and ").toLowerCase()}.` : "You leave the hall with only the storm for company.";
  return { title: tool.title, text: `${tool.text} ${relationship} ${clueSummary}`, memories: [firstMemory, `USED: ${tool.item}`, `CLUES FOUND: ${clues.length} / 3`, "CHECKPOINT 03 SAVED"] };
}

function secondResult() {
  const result = {
    ramp: { title: "THE ROUTE MARKED", text: "Harsh follows the beacon and leaves his bag at the broken rail. The light gets them down, but not everyone who sees it will be safe." },
    stairs: { title: "WHAT YOU CARRIED", text: "The maintenance stair gives Harsh a torch and a sealed first-aid kit. It also seals them inside the dark with every sound the station makes." },
    hold: { title: "ONE MORE NAME", text: "Harsh holds the bridge long enough for a stranger to cross. When the crowd settles, Kavya understands why — even if neither of them knows what that kindness will cost." }
  }[state.secondOutcome];
  return { ...result, memories: [`FOOTBRIDGE PATH: ${state.secondOutcome.toUpperCase()}`, "A WAY INTO THE TICKET HALL", "CHECKPOINT 02 SAVED"] };
}

function showSecondResult() {
  elements.dialogueShell.classList.add("hidden"); game.classList.add("end-mode");
  const result = secondResult();
  elements.resultKicker.textContent = "SECOND CHOICE REMEMBERED"; elements.resultTitle.textContent = result.title; elements.resultText.textContent = result.text;
  elements.memoryList.innerHTML = result.memories.map((memory) => `<span class="memory">${memory}</span>`).join("");
  elements.continue.classList.remove("hidden"); elements.continue.innerHTML = "SEARCH THE TICKET HALL <span>→</span>";
  elements.replay.classList.remove("hidden"); elements.replay.innerHTML = "PLAY ANOTHER PATH <span>↻</span>"; elements.clearSave.classList.add("hidden");
  elements.result.classList.remove("hidden"); elements.chapter.textContent = "CHECKPOINT 02 COMPLETE";
}

function showFinalResult() {
  elements.dialogueShell.classList.add("hidden"); game.classList.add("end-mode");
  const result = finalResult();
  elements.resultKicker.textContent = "YOUR STORY CARRIES FORWARD"; elements.resultTitle.textContent = result.title; elements.resultText.textContent = result.text;
  elements.memoryList.innerHTML = result.memories.map((memory) => `<span class="memory">${memory}</span>`).join("");
  elements.continue.classList.remove("hidden"); elements.continue.innerHTML = "ENTER DADAR EAST UNDERPASS <span>→</span>";
  elements.replay.innerHTML = "PLAY ANOTHER PATH <span>↻</span>"; elements.clearSave.classList.add("hidden"); elements.result.classList.remove("hidden"); elements.chapter.textContent = "CHECKPOINT 03 COMPLETE";
}

function episodeResult() {
  const kabir = {
    truth: { title: "THE WHOLE STORY", text: "Kabir does not forgive what Harsh could not save. But he believes Harsh when it matters, and that is enough to keep the three of them moving." },
    small: { title: "THE PART LEFT UNSAID", text: "Kabir accepts Harsh's short version. The lie is not large enough to break them tonight, but it leaves a space between them that the city may eventually fill." },
    signal: { title: "A DEAD LINE", text: "Kabir finds no signal. He follows Harsh anyway, but the question Harsh avoided walks with them into the rain." }
  }[state.kabirChoice];
  const together = state.outcome === "split" ? "Kavya reaches them only after the sirens stop." : "Kavya walks beside them, silent but present.";
  return { title: kabir.title, text: `${kabir.text} ${together}`, memories: [`KABIR TRUST ${state.values.kabirTrust >= 0 ? "+" : ""}${state.values.kabirTrust}`, `KAVYA TRUST ${state.values.kavyaTrust >= 0 ? "+" : ""}${state.values.kavyaTrust}`, `CARRIED: ${loadoutOutcome(state.selectedItem).item}`, "EPISODE 1 · ACT I CONTINUES"] };
}

function showEpisodeResult() {
  state.phase = "episode-result"; saveCheckpoint();
  elements.dialogueShell.classList.add("hidden"); game.classList.add("end-mode");
  const result = episodeResult();
  elements.resultKicker.textContent = "EPISODE 1 · THE LAST LOCAL"; elements.resultTitle.textContent = result.title; elements.resultText.textContent = result.text;
  elements.memoryList.innerHTML = result.memories.map((memory) => `<span class="memory">${memory}</span>`).join("");
  elements.continue.classList.remove("hidden"); elements.continue.innerHTML = "ENTER THE DISPENSARY <span>→</span>";
  elements.replay.innerHTML = "PLAY ANOTHER PATH <span>↻</span>"; elements.clearSave.classList.add("hidden"); elements.result.classList.remove("hidden"); elements.chapter.textContent = "EPISODE 1 COMPLETE";
}

function dispensaryResult() {
  const outcomes = {
    share: { title: "THE ROOM GETS A CHANCE", text: "Zoya turns Harsh's item into a plan for the whole dispensary. It may save people he has never met. Kavya sees the cost of that generosity." },
    keep: { title: "THE PROMISE CLOSES IN", text: "Harsh keeps the item in Kavya's hands. It is the safest answer for the person beside him — and the hardest answer for everyone behind the curtain." },
    defer: { title: "THE WEIGHT IS SHARED", text: "Zoya makes the call, but Harsh stays to help. Nobody gets a clean choice. They get one they can survive together." }
  };
  const result = outcomes[state.zoyaChoice];
  return { title: result.title, text: result.text, memories: [`ZOYA TRUST ${state.values.zoyaTrust >= 0 ? "+" : ""}${state.values.zoyaTrust}`, `GROUP SUPPLIES +${state.values.groupSupplies}`, `KAVYA TRUST ${state.values.kavyaTrust >= 0 ? "+" : ""}${state.values.kavyaTrust}`, `CARRIED ITEM: ${loadoutOutcome(state.selectedItem).item}`, "NO SIGNAL · CHAPTER ONE CONTINUES"] };
}

function showDispensaryResult() {
  state.phase = "dispensary-result"; saveCheckpoint();
  elements.dialogueShell.classList.add("hidden"); game.classList.add("end-mode");
  const result = dispensaryResult();
  elements.resultKicker.textContent = "NO SIGNAL · FIRST NIGHT"; elements.resultTitle.textContent = result.title; elements.resultText.textContent = result.text;
  elements.memoryList.innerHTML = result.memories.map((memory) => `<span class="memory">${memory}</span>`).join("");
  elements.continue.classList.remove("hidden"); elements.continue.innerHTML = "PLAN THE NIGHT ROUTE <span>→</span>";
  elements.replay.innerHTML = "PLAY ANOTHER PATH <span>↻</span>"; elements.clearSave.classList.add("hidden"); elements.result.classList.remove("hidden"); elements.chapter.textContent = "FIRST NIGHT COMPLETE";
}

function routeOutcome(route) {
  const results = {
    market: { title: "THE MARKET REMEMBERS", text: "The market still has food, water, and frightened people. Kabir trades the group into one extra night — and one extra promise they may have to honor.", kabir: 1, kavya: 0, supplies: 1 },
    drain: { title: "BELOW THE MONSOON", text: "The storm drain keeps them out of sight. Kavya never lets go of Harsh's sleeve, and the group reaches the other side with dry matches and no new allies.", kabir: 0, kavya: 1, supplies: 0 },
    bridge: { title: "VISIBLE FROM EVERYWHERE", text: "The flyover is exposed, but Zoya spots a blinking emergency repeater across the road. For the first time all night, the city gives them a direction instead of a warning.", kabir: -1, kavya: 0, supplies: 0 }
  };
  return results[route];
}

function showRouteBoard() {
  state.phase = "route"; elements.result.classList.add("hidden"); elements.route.classList.remove("hidden");
  game.classList.remove("end-mode", "underpass-mode", "footbridge-mode", "ticket-hall-mode", "east-exit-mode", "split-arrival"); game.classList.add("dispensary-mode");
  elements.stationTitle.textContent = "DADAR"; elements.stationSubtitle.textContent = "COMMUNITY DISPENSARY · ROUTE BOARD"; elements.chapter.textContent = "NO SIGNAL · BEFORE DAWN";
  elements.routeIntro.textContent = state.values.groupSupplies > 0 ? "Zoya has bought the room time. Harsh has to decide how they spend it: people, cover, or height." : "The generator has hours, not promises. Harsh has to decide what kind of danger finds them first.";
  if (state.timerOn) startRouteTimer(30000, () => selectRoute("drain", true));
  else { elements.routeTimer.textContent = "∞"; elements.routeTimerFill.style.width = "100%"; elements.routeTimerFill.style.background = "#efa946"; }
  saveCheckpoint();
}

function startRouteTimer(duration, onTimeout) {
  const started = performance.now();
  const tick = (now) => {
    const remaining = Math.max(0, duration - (now - started)); const percentage = remaining / duration;
    elements.routeTimerFill.style.width = `${percentage * 100}%`; elements.routeTimerFill.style.background = percentage < .3 ? "#db4c53" : "#efa946";
    elements.routeTimer.textContent = Math.ceil(remaining / 1000);
    if (remaining <= 0) { onTimeout(); return; }
    state.timerId = requestAnimationFrame(tick);
  };
  state.timerId = requestAnimationFrame(tick);
}

function selectRoute(route, timedOut = false) {
  if (state.timerId) cancelAnimationFrame(state.timerId);
  state.timerId = null; state.routeChoice = route; state.phase = "route-result"; elements.route.classList.add("hidden");
  const outcome = routeOutcome(route); state.values.kabirTrust += outcome.kabir; state.values.kavyaTrust += outcome.kavya; state.values.groupSupplies += outcome.supplies;
  saveCheckpoint(); elements.chapter.textContent = timedOut ? "THE NIGHT CHOSE FOR YOU" : "ROUTE REMEMBERED"; showRouteResult();
}

function routeResult() {
  const result = routeOutcome(state.routeChoice);
  return { title: result.title, text: result.text, memories: [`ROUTE: ${state.routeChoice.toUpperCase()}`, `KABIR TRUST ${state.values.kabirTrust >= 0 ? "+" : ""}${state.values.kabirTrust}`, `KAVYA TRUST ${state.values.kavyaTrust >= 0 ? "+" : ""}${state.values.kavyaTrust}`, `GROUP SUPPLIES +${state.values.groupSupplies}`, "NO SIGNAL · ROUTE SET"] };
}

function showRouteResult() {
  elements.dialogueShell.classList.add("hidden"); elements.route.classList.add("hidden"); game.classList.add("end-mode");
  const result = routeResult();
  elements.resultKicker.textContent = "NO SIGNAL · NIGHT ROUTE"; elements.resultTitle.textContent = result.title; elements.resultText.textContent = result.text;
  elements.memoryList.innerHTML = result.memories.map((memory) => `<span class="memory">${memory}</span>`).join("");
  elements.continue.classList.remove("hidden"); elements.continue.innerHTML = "FOLLOW THE SIGNAL <span>→</span>"; elements.replay.innerHTML = "PLAY ANOTHER PATH <span>↻</span>"; elements.clearSave.classList.add("hidden"); elements.result.classList.remove("hidden"); elements.chapter.textContent = "NO SIGNAL · ROUTE SET";
}

function beginSignal({ save = true } = {}) {
  state.phase = "signal"; state.line = 0; elements.result.classList.add("hidden"); elements.dialogueShell.classList.remove("hidden");
  game.classList.remove("end-mode", "dispensary-mode", "underpass-mode", "footbridge-mode", "ticket-hall-mode", "east-exit-mode", "split-arrival"); game.classList.add("signal-mode");
  elements.stationTitle.textContent = "DADAR"; elements.stationSubtitle.textContent = "EMERGENCY REPEATER · 91.4";
  if (save) saveCheckpoint(); showLine(activeLines()[0]);
}

function signalResult() {
  const results = {
    answer: { title: "A VOICE ANSWERS", text: "Harsh opens the channel. In a city that has been swallowing names all night, an unknown group now knows where the light is." },
    quiet: { title: "THE ROOM STAYS HIDDEN", text: "Harsh lets the radio die unanswered. The silence protects the people beside him — and leaves someone else in the rain." },
    decoy: { title: "A LIE GETS THERE FIRST", text: "Harsh sends danger toward an empty place. The group gets distance, but the radio turns the choice into a debt." }
  };
  const result = results[state.signalChoice];
  return { title: result.title, text: result.text, memories: [`ROUTE: ${state.routeChoice.toUpperCase()}`, `RADIO: ${state.signalChoice.toUpperCase()}`, `KAVYA TRUST ${state.values.kavyaTrust >= 0 ? "+" : ""}${state.values.kavyaTrust}`, `KABIR TRUST ${state.values.kabirTrust >= 0 ? "+" : ""}${state.values.kabirTrust}`, `ZOYA TRUST ${state.values.zoyaTrust >= 0 ? "+" : ""}${state.values.zoyaTrust}`, "NO SIGNAL · FIRST NIGHT CONTINUES"] };
}

function showSignalResult() {
  state.phase = "signal-result"; saveCheckpoint(); elements.dialogueShell.classList.add("hidden"); game.classList.add("end-mode");
  const result = signalResult();
  elements.resultKicker.textContent = "NO SIGNAL · THE FIRST VOICE"; elements.resultTitle.textContent = result.title; elements.resultText.textContent = result.text;
  elements.memoryList.innerHTML = result.memories.map((memory) => `<span class="memory">${memory}</span>`).join("");
  elements.continue.classList.remove("hidden"); elements.continue.innerHTML = "GO TO THE SERVICE GATE <span>→</span>"; elements.replay.innerHTML = "PLAY ANOTHER PATH <span>↻</span>"; elements.clearSave.classList.add("hidden"); elements.result.classList.remove("hidden"); elements.chapter.textContent = "NO SIGNAL · THE VOICE MOVES";
}

function beginGate({ save = true } = {}) {
  state.phase = "gate"; state.line = 0; elements.result.classList.add("hidden"); elements.dialogueShell.classList.remove("hidden");
  game.classList.remove("end-mode", "signal-mode", "dispensary-mode", "underpass-mode", "footbridge-mode", "ticket-hall-mode", "east-exit-mode", "split-arrival"); game.classList.add("gate-mode");
  elements.stationTitle.textContent = "DADAR"; elements.stationSubtitle.textContent = "SERVICE ANNEX · EAST ACCESS";
  if (save) saveCheckpoint(); showLine(activeLines()[0]);
}

function gateResult() {
  const results = {
    open: { title: "THE GATE OPENS", text: "Harsh lets Raghav and an injured stranger into the light. The group has one more mouth to feed — and a witness to the night the city went dark." },
    verify: { title: "ONE QUESTION BETWEEN THEM", text: "Harsh makes Raghav prove his name before the latch turns. It buys the room a little certainty and costs the stranger a little time." },
    seal: { title: "THE SOUND OUTSIDE", text: "Harsh leaves the gate sealed. Kavya is safer for the moment, but a name and a child remain on the wrong side of the rain." }
  };
  const result = results[state.gateChoice];
  return { title: result.title, text: result.text, memories: [`RADIO: ${state.signalChoice.toUpperCase()}`, `GATE: ${state.gateChoice.toUpperCase()}`, `RAGHAV TRUST ${state.values.raghavTrust >= 0 ? "+" : ""}${state.values.raghavTrust}`, `ZOYA TRUST ${state.values.zoyaTrust >= 0 ? "+" : ""}${state.values.zoyaTrust}`, `GROUP SUPPLIES +${state.values.groupSupplies}`, "NO SIGNAL · FIRST NIGHT COMPLETE"] };
}

function showGateResult() {
  state.phase = "gate-result"; saveCheckpoint(); elements.dialogueShell.classList.add("hidden"); game.classList.add("end-mode");
  const result = gateResult();
  elements.resultKicker.textContent = "NO SIGNAL · THE SERVICE GATE"; elements.resultTitle.textContent = result.title; elements.resultText.textContent = result.text;
  elements.memoryList.innerHTML = result.memories.map((memory) => `<span class="memory">${memory}</span>`).join("");
  elements.continue.classList.remove("hidden"); elements.continue.innerHTML = "VIEW FIRST NIGHT RECAP <span>→</span>"; elements.replay.innerHTML = "PLAY ANOTHER PATH <span>↻</span>"; elements.clearSave.classList.add("hidden"); elements.result.classList.remove("hidden"); elements.chapter.textContent = "NO SIGNAL · FIRST NIGHT COMPLETE";
}

function choiceLabel(value, labels) { return labels[value] || "UNRESOLVED"; }

function showRecap() {
  state.phase = "recap"; saveCheckpoint(); elements.result.classList.add("hidden"); elements.dialogueShell.classList.add("hidden"); elements.recap.classList.remove("hidden");
  game.classList.remove("end-mode", "gate-mode", "signal-mode", "dispensary-mode", "underpass-mode", "footbridge-mode", "ticket-hall-mode", "east-exit-mode", "split-arrival"); game.classList.add("recap-mode");
  const opening = choiceLabel(state.outcome, { stay: "STAYED WITH KAVYA", help: "SAVED ROHAN", split: "SPLIT THE GROUP" });
  const route = choiceLabel(state.routeChoice, { market: "MARKET STREET", drain: "STORM DRAIN", bridge: "THE FLYOVER" });
  const radio = choiceLabel(state.signalChoice, { answer: "ANSWERED THE VOICE", quiet: "KEPT THE RADIO DARK", decoy: "SENT A FALSE ROUTE" });
  const gate = choiceLabel(state.gateChoice, { open: "OPENED THE GATE", verify: "DEMANDED PROOF", seal: "LEFT IT SEALED" });
  elements.recapLead.textContent = state.gateChoice === "seal" ? "The rain still carries a child's name beyond the service gate." : "The room has another survivor, and the city has one more reason to remember this group.";
  const cards = [
    ["THE PLATFORM", opening], ["THE NIGHT ROUTE", route], ["THE RADIO", radio], ["THE GATE", gate],
    ["KAVYA", `TRUST ${state.values.kavyaTrust >= 0 ? "+" : ""}${state.values.kavyaTrust}`], ["KABIR", `TRUST ${state.values.kabirTrust >= 0 ? "+" : ""}${state.values.kabirTrust}`],
    ["ZOYA", `TRUST ${state.values.zoyaTrust >= 0 ? "+" : ""}${state.values.zoyaTrust}`], ["RAGHAV", `TRUST ${state.values.raghavTrust >= 0 ? "+" : ""}${state.values.raghavTrust}`]
  ];
  elements.recapGrid.innerHTML = cards.map(([label, value]) => `<article><span>${label}</span><strong>${value}</strong></article>`).join("");
  elements.chapter.textContent = "EPISODE 1 · ACT I COMPLETE";
}

function beginFootbridge({ save = true } = {}) {
  state.phase = "footbridge"; state.line = 0; elements.result.classList.add("hidden"); elements.dialogueShell.classList.remove("hidden");
  game.classList.remove("end-mode"); game.classList.add("footbridge-mode"); elements.leela.classList.add("hidden");
  elements.stationTitle.textContent = "DADAR"; elements.stationSubtitle.textContent = "FOOTBRIDGE · EXIT EAST";
  if (save) saveCheckpoint(); showLine(activeLines()[0]);
}

function beginUnderpass({ save = true } = {}) {
  state.phase = "underpass"; state.line = 0; elements.result.classList.add("hidden"); elements.dialogueShell.classList.remove("hidden");
  game.classList.remove("end-mode", "east-exit-mode", "ticket-hall-mode", "footbridge-mode"); game.classList.add("underpass-mode");
  game.classList.toggle("split-arrival", state.outcome === "split"); elements.leela.classList.add("hidden");
  elements.stationTitle.textContent = "DADAR EAST"; elements.stationSubtitle.textContent = "UNDERPASS · WARD 3";
  if (save) saveCheckpoint(); showLine(activeLines()[0]);
}

function beginDispensary({ save = true } = {}) {
  state.phase = "dispensary"; state.line = 0; elements.result.classList.add("hidden"); elements.dialogueShell.classList.remove("hidden");
  game.classList.remove("end-mode", "underpass-mode", "east-exit-mode", "ticket-hall-mode", "footbridge-mode", "split-arrival"); game.classList.add("dispensary-mode");
  elements.leela.classList.add("hidden"); elements.stationTitle.textContent = "DADAR"; elements.stationSubtitle.textContent = "COMMUNITY DISPENSARY · TRIAGE";
  if (save) saveCheckpoint(); showLine(activeLines()[0]);
}

function initialHallItem() {
  return state.secondOutcome === "stairs" ? "FIRST-AID KIT" : state.secondOutcome === "hold" ? "FOLDING UMBRELLA" : "WET MATCHBOOK";
}

function hallMessage() {
  if (state.outcome === "stay") return "Kavya stands close beside Harsh. Rain needles through the broken roof. Something is still ringing near the gates.";
  if (state.outcome === "help") return "Kavya flexes her injured hand and scans the empty ticket windows. Something is still ringing near the gates.";
  return "Kavya's voice arrives through the dark from the ticket-office side. Something is still ringing near the gates.";
}

function beginExplore({ save = true } = {}) {
  state.phase = "explore"; elements.result.classList.add("hidden"); elements.dialogueShell.classList.add("hidden"); elements.explore.classList.remove("hidden");
  game.classList.remove("end-mode", "footbridge-mode"); game.classList.add("ticket-hall-mode"); elements.leela.classList.add("hidden");
  elements.stationTitle.textContent = "DADAR"; elements.stationSubtitle.textContent = "TICKET HALL · EAST EXIT"; elements.chapter.textContent = "THE TICKET HALL · SEARCH";
  renderExplore(); if (save) saveCheckpoint();
}

function clueText(clue) {
  const text = {
    map: "The evacuation map is marked by hand: EAST EXIT is flooded. Someone circled a service lane toward the old post office.",
    locker: state.secondOutcome === "stairs" ? "The locker is empty except for a bolt cutter and a staff badge. The first-aid kit you found below might matter later." : "Inside the locker: a bolt cutter, a staff badge, and a dry strip of gauze.",
    phone: state.outcome === "stay" ? "The phone has one unsent recording: ‘Harsh, if we get out, don't make promises just because you're afraid.’" : state.outcome === "help" ? "The phone has one unsent recording: ‘You were scared too. That's not the same as being wrong.’" : "The phone has one unsent recording: ‘Old ticket office. If we lose each other, listen for the shutters.’"
  };
  return text[clue];
}

function clueItem(clue) {
  return { map: "SERVICE LANE MAP", locker: "BOLT CUTTER", phone: "UNSENT RECORDING" }[clue];
}

function inspectClue(clue) {
  if (state.clues[clue]) return;
  state.clues[clue] = clueItem(clue); elements.exploreLog.textContent = clueText(clue); renderExplore(); saveCheckpoint(); sound("choice");
}

function renderExplore() {
  const count = Object.keys(state.clues).length;
  elements.exploreObjective.textContent = `INSPECT ${Math.min(count, 2)} / 2 CLUES`;
  elements.foundItems.innerHTML = [initialHallItem(), ...Object.values(state.clues)].map((item) => `<span class="found-item">${item}</span>`).join("");
  document.querySelectorAll("[data-clue]").forEach((button) => {
    const seen = Boolean(state.clues[button.dataset.clue]); button.classList.toggle("inspected", seen); button.disabled = seen;
    if (seen) button.innerHTML = `<span>✓</span>${clueItem(button.dataset.clue)}`;
  });
  elements.exitHall.disabled = count < 2;
  if (count === 0) elements.exploreLog.textContent = hallMessage();
  if (count >= 2) elements.exploreLog.textContent += " You have enough to choose a route."
}

function leaveTicketHall() {
  if (Object.keys(state.clues).length < 2) return;
  state.phase = "loadout"; elements.explore.classList.add("hidden"); game.classList.remove("ticket-hall-mode"); saveCheckpoint(); showLoadout();
}

function initialItemData() {
  return state.secondOutcome === "stairs"
    ? { id: "kit", item: "FIRST-AID KIT", title: "TREAT KAVYA'S HAND", detail: "Buy time, but stop in the open." }
    : state.secondOutcome === "hold"
      ? { id: "umbrella", item: "FOLDING UMBRELLA", title: "COVER THE FLARE", detail: "Hide the light and move as one." }
      : { id: "matches", item: "WET MATCHBOOK", title: "LIGHT A DISTRACTION", detail: "One brief flash. One chance to run." };
}

function loadoutOptions() {
  const options = [initialItemData()];
  if (state.clues.map) options.push({ id: "map", item: "SERVICE LANE MAP", title: "FOLLOW THE SERVICE LANE", detail: "Trade speed for a route no one can see." });
  if (state.clues.locker) options.push({ id: "cutter", item: "BOLT CUTTER", title: "CUT THE SHUTTER", detail: "Make your own exit before the water rises." });
  if (state.clues.phone) options.push({ id: "recording", item: "UNSENT RECORDING", title: "PLAY THE RECORDING", detail: "Use a familiar voice to draw danger away." });
  return options;
}

function loadoutOutcome(item) {
  const outcomes = {
    kit: { item: "FIRST-AID KIT", title: "A QUIET BANDAGE", text: "Harsh wraps Kavya's hand under the shutter's thin strip of light. The delay costs them the easy route, but she does not have to hide the pain anymore." },
    umbrella: { item: "FOLDING UMBRELLA", title: "BELOW THE LIGHT", text: "The umbrella catches the beacon's glare. Harsh and Kavya slip under its broken silhouette while the crowd follows brighter targets." },
    matches: { item: "WET MATCHBOOK", title: "THREE SECONDS OF FIRE", text: "The first strike dies. The second burns just long enough to pull every eye toward the water — and give Harsh an opening." },
    map: { item: "SERVICE LANE MAP", title: "THE LINE ON THE MAP", text: "Harsh follows the pencilled service lane through shuttered kiosks. The route is slow, but it takes them where the panic is not." },
    cutter: { item: "BOLT CUTTER", title: "THE SHUTTER GIVES", text: "One hard cut breaks the chain. The exit opens into rain and floodwater, but it is an exit nobody else prepared for." },
    recording: { item: "UNSENT RECORDING", title: "A VOICE IN THE RAIN", text: "Kavya's recorded voice echoes across the empty hall. For a moment, the station turns toward the sound — and Harsh turns the other way." }
  };
  return outcomes[item] || outcomes[initialItemData().id];
}

function showLoadout() {
  state.phase = "loadout"; elements.loadout.classList.remove("hidden"); game.classList.add("east-exit-mode");
  elements.stationTitle.textContent = "DADAR"; elements.stationSubtitle.textContent = "EAST EXIT · FLOOD LEVEL RISING"; elements.chapter.textContent = "THE EAST EXIT · LAST MOVE";
  elements.loadoutText.textContent = state.outcome === "stay" ? "Kavya says nothing. The shutter shakes in its rails, and water is already climbing the steps." : state.outcome === "help" ? "Kavya's hand is blistered. The shutter shakes in its rails, and water is already climbing the steps." : "Kavya is somewhere beyond the shutter. Water is already climbing the steps.";
  const options = loadoutOptions(); state.currentLoadoutOptions = options; elements.loadoutGrid.innerHTML = "";
  options.forEach((option, index) => {
    const button = document.createElement("button"); button.className = "loadout-choice"; button.dataset.item = option.id;
    button.innerHTML = `<span>${index + 1}</span><strong>${option.title}</strong><small>${option.detail}</small>`;
    button.addEventListener("click", () => selectLoadout(option.id)); elements.loadoutGrid.appendChild(button);
  });
  if (state.timerOn) startLoadoutTimer(30000, () => selectLoadout(options[0].id, true));
  else { elements.loadoutTimer.textContent = "∞"; elements.loadoutTimerFill.style.width = "100%"; elements.loadoutTimerFill.style.background = "#efa946"; }
}

function startLoadoutTimer(duration, onTimeout) {
  const started = performance.now();
  const tick = (now) => {
    const remaining = Math.max(0, duration - (now - started)); const percentage = remaining / duration;
    elements.loadoutTimerFill.style.width = `${percentage * 100}%`; elements.loadoutTimerFill.style.background = percentage < .3 ? "#db4c53" : "#efa946";
    elements.loadoutTimer.textContent = Math.ceil(remaining / 1000);
    if (remaining <= 0) { onTimeout(); return; }
    state.timerId = requestAnimationFrame(tick);
  };
  state.timerId = requestAnimationFrame(tick);
}

function selectLoadout(item, timedOut = false) {
  if (state.timerId) cancelAnimationFrame(state.timerId);
  state.timerId = null; state.selectedItem = item; state.phase = "east-result"; elements.loadout.classList.add("hidden"); game.classList.remove("east-exit-mode");
  saveCheckpoint(); elements.chapter.textContent = timedOut ? "THE WATER DECIDED" : "LAST MOVE REMEMBERED"; showFinalResult();
}

function safeStorage() { return typeof localStorage === "undefined" ? null : localStorage; }

function saveCheckpoint() {
  try {
    safeStorage()?.setItem(SAVE_KEY, JSON.stringify({ version: 11, phase: state.phase, outcome: state.outcome, secondOutcome: state.secondOutcome, values: state.values, clues: state.clues, selectedItem: state.selectedItem, kabirChoice: state.kabirChoice, zoyaChoice: state.zoyaChoice, routeChoice: state.routeChoice, signalChoice: state.signalChoice, gateChoice: state.gateChoice, savedAt: Date.now() }));
    showSaveToast(); updateResumeButton();
  } catch (_) { /* Browser privacy settings may disable file:// storage; gameplay remains unaffected. */ }
}

function readCheckpoint() {
  try {
    const saved = JSON.parse(safeStorage()?.getItem(SAVE_KEY) || "null");
    return saved?.version === 11 && ["outcome", "footbridge", "second-result", "explore", "loadout", "east-result", "underpass", "kabir-result", "episode-result", "dispensary", "zoya-result", "dispensary-result", "route", "route-result", "signal", "signal-result", "gate", "gate-result", "recap"].includes(saved.phase) && firstResults[saved.outcome] ? saved : null;
  } catch (_) { return null; }
}

function showSaveToast() {
  elements.toast.classList.add("hidden"); void elements.toast.offsetWidth; elements.toast.classList.remove("hidden");
  window.setTimeout(() => elements.toast.classList.add("hidden"), 2500);
}

function updateResumeButton() { elements.resume.classList.toggle("hidden", !readCheckpoint()); }

function clearCheckpoint(showTitle = true) {
  try { safeStorage()?.removeItem(SAVE_KEY); } catch (_) { /* Nothing to clear. */ }
  updateResumeButton();
  if (showTitle) returnToTitle();
}

function startGame() {
  clearCheckpoint(false); resetState(); elements.title.classList.add("hidden"); elements.result.classList.add("hidden"); elements.dialogueShell.classList.remove("hidden");
  game.classList.remove("title-mode", "end-mode", "footbridge-mode", "ticket-hall-mode", "east-exit-mode", "underpass-mode", "dispensary-mode", "signal-mode", "gate-mode", "recap-mode", "split-arrival"); elements.stationTitle.textContent = "DADAR"; elements.stationSubtitle.textContent = "PLATFORM 3 · LAST LOCAL";
  elements.explore.classList.add("hidden"); elements.loadout.classList.add("hidden"); elements.route.classList.add("hidden"); elements.recap.classList.add("hidden"); elements.chapter.textContent = "THE LAST LOCAL · OPENING"; showLine(openingLines[0]);
}

function resumeGame() {
  const saved = readCheckpoint(); if (!saved) return;
  resetState(); state.phase = saved.phase; state.outcome = saved.outcome; state.secondOutcome = saved.secondOutcome; state.values = { ...state.values, ...saved.values }; state.clues = saved.clues || {}; state.selectedItem = saved.selectedItem || null; state.kabirChoice = saved.kabirChoice || null; state.zoyaChoice = saved.zoyaChoice || null; state.routeChoice = saved.routeChoice || null; state.signalChoice = saved.signalChoice || null; state.gateChoice = saved.gateChoice || null;
  elements.title.classList.add("hidden"); elements.result.classList.add("hidden"); game.classList.remove("title-mode", "end-mode", "footbridge-mode", "ticket-hall-mode", "east-exit-mode", "underpass-mode", "dispensary-mode", "signal-mode", "gate-mode", "recap-mode", "split-arrival");
  if (state.phase === "outcome") { elements.dialogueShell.classList.remove("hidden"); state.line = 0; showLine(activeLines()[0]); }
  if (state.phase === "footbridge") beginFootbridge({ save: false });
  if (state.phase === "second-result") showSecondResult();
  if (state.phase === "explore") beginExplore({ save: false });
  if (state.phase === "loadout") showLoadout();
  if (state.phase === "east-result") showFinalResult();
  if (state.phase === "underpass") beginUnderpass({ save: false });
  if (state.phase === "kabir-result") { elements.dialogueShell.classList.remove("hidden"); game.classList.add("underpass-mode"); game.classList.toggle("split-arrival", state.outcome === "split"); state.line = 0; showLine(activeLines()[0]); }
  if (state.phase === "episode-result") showEpisodeResult();
  if (state.phase === "dispensary") beginDispensary({ save: false });
  if (state.phase === "zoya-result") { elements.dialogueShell.classList.remove("hidden"); game.classList.add("dispensary-mode"); state.line = 0; showLine(activeLines()[0]); }
  if (state.phase === "dispensary-result") showDispensaryResult();
  if (state.phase === "route") showRouteBoard();
  if (state.phase === "route-result") showRouteResult();
  if (state.phase === "signal") beginSignal({ save: false });
  if (state.phase === "signal-result") showSignalResult();
  if (state.phase === "gate") beginGate({ save: false });
  if (state.phase === "gate-result") showGateResult();
  if (state.phase === "recap") showRecap();
}

function returnToTitle() {
  resetState(); elements.result.classList.add("hidden"); elements.dialogueShell.classList.add("hidden"); elements.title.classList.remove("hidden");
  game.classList.add("title-mode"); game.classList.remove("end-mode", "footbridge-mode", "ticket-hall-mode", "east-exit-mode", "underpass-mode", "dispensary-mode", "signal-mode", "gate-mode", "recap-mode", "split-arrival"); elements.stationTitle.textContent = "DADAR"; elements.stationSubtitle.textContent = "PLATFORM 3 · LAST LOCAL";
  elements.explore.classList.add("hidden"); elements.loadout.classList.add("hidden"); elements.route.classList.add("hidden"); elements.recap.classList.add("hidden"); elements.kabir.classList.add("hidden"); elements.zoya.classList.add("hidden"); elements.raghav.classList.add("hidden"); elements.chapter.textContent = "EPISODE 1 · THE LAST TRAIN"; updateResumeButton();
}

function resetState() {
  if (state.timerId) cancelAnimationFrame(state.timerId); window.clearInterval(state.typeTimer);
  state.phase = "opening"; state.line = 0; state.typing = false; state.outcome = null; state.secondOutcome = null; state.timerId = null; state.clues = {}; state.selectedItem = null; state.kabirChoice = null; state.zoyaChoice = null; state.routeChoice = null; state.signalChoice = null; state.gateChoice = null;
  state.values = { kavyaTrust: 0, kabirTrust: 0, zoyaTrust: 0, raghavTrust: 0, groupSupplies: 0, savedRohan: false, leftLeela: false, keptPromise: false };
  elements.leela.classList.add("hidden"); elements.kabir.classList.add("hidden"); elements.zoya.classList.add("hidden"); elements.raghav.classList.add("hidden"); elements.choiceShell.classList.add("hidden"); game.classList.remove("choice-mode");
}

$("#startButton").addEventListener("click", startGame);
elements.resume.addEventListener("click", resumeGame);
elements.advance.addEventListener("click", nextLine);
elements.continue.addEventListener("click", () => {
  if (state.phase === "second-result") beginExplore();
  else if (state.phase === "east-result") beginUnderpass();
  else if (state.phase === "episode-result") beginDispensary();
  else if (state.phase === "dispensary-result") showRouteBoard();
  else if (state.phase === "route-result") beginSignal();
  else if (state.phase === "signal-result") beginGate();
  else if (state.phase === "gate-result") showRecap();
  else beginFootbridge();
});
elements.replay.addEventListener("click", returnToTitle);
elements.clearSave.addEventListener("click", () => clearCheckpoint(true));
elements.recapTitle.addEventListener("click", () => { clearCheckpoint(false); returnToTitle(); });
elements.exitHall.addEventListener("click", leaveTicketHall);
document.querySelectorAll("[data-clue]").forEach((button) => button.addEventListener("click", () => inspectClue(button.dataset.clue)));
document.querySelectorAll("[data-route]").forEach((button) => button.addEventListener("click", () => selectRoute(button.dataset.route)));
$("#settingsButton").addEventListener("click", () => { const visible = !elements.settings.classList.toggle("hidden"); $("#settingsButton").setAttribute("aria-expanded", String(visible)); });
$("#restartButton").addEventListener("click", () => { elements.settings.classList.add("hidden"); startGame(); });
elements.timerToggle.addEventListener("click", () => { state.timerOn = !state.timerOn; elements.timerToggle.textContent = state.timerOn ? "ON" : "OFF"; elements.timerToggle.setAttribute("aria-pressed", String(state.timerOn)); });
elements.soundToggle.addEventListener("click", () => { state.soundOn = !state.soundOn; elements.soundToggle.textContent = state.soundOn ? "ON" : "OFF"; elements.soundToggle.setAttribute("aria-pressed", String(state.soundOn)); if (state.soundOn) { setAmbience(); sound("choice"); } else stopAmbience(); });
elements.voiceToggle.addEventListener("click", () => { state.voiceOn = !state.voiceOn; elements.voiceToggle.textContent = state.voiceOn ? "ON" : "OFF"; elements.voiceToggle.setAttribute("aria-pressed", String(state.voiceOn)); if (!state.voiceOn) window.speechSynthesis?.cancel(); });
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") { elements.settings.classList.add("hidden"); return; }
  if (!elements.choiceShell.classList.contains("hidden") && ["1", "2", "3"].includes(event.key)) {
    const selected = state.currentChoices?.[Number(event.key) - 1];
    if (selected) {
      if (state.phase === "opening") chooseFirst(selected.outcome);
      else if (state.phase === "footbridge") chooseSecond(selected.outcome);
      else if (state.phase === "underpass") chooseKabir(selected.outcome);
      else if (state.phase === "dispensary") chooseZoya(selected.outcome);
      else if (state.phase === "signal") chooseSignal(selected.outcome);
      else if (state.phase === "gate") chooseGate(selected.outcome);
    }
    return;
  }
  if (state.phase === "explore" && ["1", "2", "3"].includes(event.key)) {
    const clues = ["map", "locker", "phone"]; inspectClue(clues[Number(event.key) - 1]); return;
  }
  if (state.phase === "loadout" && ["1", "2", "3"].includes(event.key)) {
    const selected = state.currentLoadoutOptions?.[Number(event.key) - 1]; if (selected) selectLoadout(selected.id); return;
  }
  if (state.phase === "route" && ["1", "2", "3"].includes(event.key)) {
    selectRoute(["market", "drain", "bridge"][Number(event.key) - 1]); return;
  }
  if ((event.code === "Space" || event.key === "Enter") && !elements.dialogueShell.classList.contains("hidden")) { event.preventDefault(); nextLine(); }
});

buildRain(); updateResumeButton();
