const factors = {
  noise: ['Very quiet', 'Moderate', 'Noisy'], lighting: ['Bright', 'Adequate', 'Dim'], temperature: ['Cool', 'Comfortable', 'Warm'],
  people: ['Alone', 'Friends', 'Strangers'], seating: ['Individual desk', 'Shared table', 'Study cubicle'], monitor: ['Available', 'Unavailable'],
  outlet: ['Available', 'Unavailable'], entrance: ['Near', 'Moderate', 'Far'], printer: ['Near', 'Moderate', 'Far'], trash: ['Near', 'Moderate', 'Far']
};
const labels = {noise:'Noise',lighting:'Lighting',temperature:'Temperature',people:'People nearby',seating:'Table type',monitor:'Monitor',outlet:'Power outlet',entrance:'Entrance',printer:'Printer',trash:'Trash can'};
const seats = [
  {number:'A',noise:'Very quiet',lighting:'Adequate',temperature:'Cool',people:'Alone',seating:'Individual desk',monitor:'Unavailable',outlet:'Available',entrance:'Far',printer:'Far',trash:'Far'},
  {number:'B',noise:'Very quiet',lighting:'Bright',temperature:'Comfortable',people:'Alone',seating:'Study cubicle',monitor:'Available',outlet:'Available',entrance:'Moderate',printer:'Near',trash:'Near'},
  {number:'C',noise:'Moderate',lighting:'Bright',temperature:'Warm',people:'Friends',seating:'Shared table',monitor:'Available',outlet:'Available',entrance:'Near',printer:'Near',trash:'Near'},
  {number:'D',noise:'Very quiet',lighting:'Dim',temperature:'Comfortable',people:'Strangers',seating:'Study cubicle',monitor:'Available',outlet:'Unavailable',entrance:'Moderate',printer:'Far',trash:'Near'}
];
const preferences = document.querySelector('#preferences');
for (const [key, options] of Object.entries(factors)) {
  const label = document.createElement('label'); label.textContent = labels[key];
  const select = document.createElement('select'); select.name = key;
  select.innerHTML = `<option value="No preference">No preference</option>${options.map(option => `<option value="${option}">${option}</option>`).join('')}`;
  label.append(select); preferences.append(label);
}
function matchPoints(actual, preferred, key) { if (actual === preferred) return 3; if (['monitor','outlet'].includes(key)) return 1; const distance = Math.abs(factors[key].indexOf(actual) - factors[key].indexOf(preferred)); return distance === 1 ? 2 : 1; }
function currentPreferences() { return Object.fromEntries([...document.querySelectorAll('select')].map(select => [select.name, select.value])); }
function rankSeats() {
  const prefs = currentPreferences();
  const chosenFactors = Object.keys(prefs).filter(key => prefs[key] !== 'No preference');
  const scored = seats.map(seat => {
    const points = chosenFactors.reduce((total,key) => total + matchPoints(seat[key],prefs[key],key),0);
    return {...seat, score: chosenFactors.length ? Math.round(points / (chosenFactors.length * 3) * 100) : null};
  }).sort((a,b) => (b.score ?? -1) - (a.score ?? -1));
  renderResults(scored, chosenFactors.length);
}
function renderResults(items, factorCount) {
  const list = document.querySelector('#seat-list');
  list.replaceChildren();
  document.querySelector('#summary').textContent = factorCount ? `${factorCount} factor${factorCount===1?'':'s'} included · 3 points for an exact match` : 'No preferences selected · seats are shown without a rank';
  items.forEach((seat,index) => {
    const card = document.querySelector('#seat-template').content.firstElementChild.cloneNode(true);
    card.querySelector('.rank').textContent = `RANK ${index + 1}`;
    card.querySelector('h3').textContent = `Seat ${seat.number}`; card.querySelector('.score').textContent = seat.score === null ? 'Not ranked' : `${seat.score}% match`;
    card.querySelector('.status').textContent = 'Compare the seat features, then choose the option that works best for you.';
    const shown = ['noise','lighting','seating','monitor','outlet','entrance'];
    card.querySelector('.features').innerHTML = shown.map(key => `<div><dt>${labels[key]}</dt><dd>${seat[key]}</dd></div>`).join('');
    card.querySelector('.choose-button').addEventListener('click',event => { document.querySelectorAll('.seat-card').forEach(item => item.classList.remove('chosen')); card.classList.add('chosen'); event.currentTarget.textContent = `Seat ${seat.number} selected`; });
    list.append(card);
  });
}
document.querySelector('#recommend').addEventListener('click',rankSeats);
document.querySelector('#reset').addEventListener('click',() => { document.querySelectorAll('select').forEach(select => select.value='No preference'); rankSeats(); });
rankSeats();
