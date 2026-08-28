// Flat, equipment-tagged exercise library used by the onboarding plan generator
// (src/planGenerator.js). Separate from defaultData.js/exercisePools.js on purpose —
// those stay untouched so existing users' saved plans never silently regenerate.
//
// Every entry carries an explicit iconType (see resolveIconType in icons.jsx) so
// growing this list never adds risk to the name-sniffing regex fallback used only
// for free-typed, ad-hoc exercises.
//
// equipment values: "bodyweight", "band", "pullup_bar", "dumbbell", "bike",
// "running", "jump_rope". A home user is shown an exercise if ANY of its equipment
// tags match what they picked, or if it's tagged "bodyweight". Gym users see
// everything regardless of tags (see planGenerator.js eligible()).

export const EXERCISE_LIBRARY = {
  push: [
    { name: "Pompki z rękami na podwyższeniu", sets: 3, reps: "10-15", note: "Łatwiejszy wariant — im wyżej ręce, tym lżej. Dobry punkt startowy dla początkujących.", iconType: "push", equipment: ["bodyweight"] },
    { name: "Pompki hinduskie", sets: 3, reps: "8-12", note: "Z pozycji górnego psa płynnie przejdź biodrami w dół i do przodu, potem znów w górę", iconType: "push", equipment: ["bodyweight"] },
    { name: "Pompki łucznicze", sets: 3, reps: "6-10/stronę", note: "Jedna ręka szeroko na boku prosta, druga zgina się — przenosisz ciężar na zginaną stronę", iconType: "push", equipment: ["bodyweight"] },
    { name: "Pompki szerokie", sets: 3, reps: "8-12", note: "Dłonie znacznie szerzej niż barki — mocniej pracuje klatka piersiowa", iconType: "push", equipment: ["bodyweight"] },
    { name: "Pompki Spider-Man", sets: 3, reps: "8-10/stronę", note: "W trakcie schodzenia w dół podciągnij kolano do łokcia po tej samej stronie", iconType: "push", equipment: ["bodyweight"] },
    { name: "Pompki piramida (pike push-up)", sets: 3, reps: "6-10", note: "Biodra wysoko w górze jak odwrócone V, głowa opada między dłonie — mocniej pracują barki", iconType: "pressoverhead", equipment: ["bodyweight"] },
    { name: "Rozciąganie gumy przed klatką (pull-apart)", sets: 3, reps: "15-20", note: "Ręce proste przed sobą, rozciągaj gumę na boki ściągając łopatki", iconType: "chestfly", equipment: ["band"] },
    { name: "Wyciskanie hantli leżąc", sets: 4, reps: "8-12", note: "Leżąc na plecach (na macie/ławce), wypychaj hantle prosto w górę nad klatką", iconType: "push", equipment: ["dumbbell"] },
    { name: "Wyciskanie hantli nad głowę", sets: 3, reps: "8-12", note: "Stojąc lub siedząc, wypchnij hantle prosto w górę nad głowę bez odginania pleców", iconType: "pressoverhead", equipment: ["dumbbell"] },
    { name: "Wznosy boczne z hantlami", sets: 3, reps: "12-15", note: "Unoś hantle do wysokości barków, łokcie lekko ugięte, bez szarpania", iconType: "lateralraise", equipment: ["dumbbell"] },
  ],
  pull: [
    { name: "Podciąganie negatywne", sets: 4, reps: "5-6", note: "Wskocz/wejdź do góry, potem opuszczaj się bardzo powoli (3-5s) — buduje siłę do pełnych podciągnięć", iconType: "pullupfront", equipment: ["pullup_bar"] },
    { name: "Uniesienia kolan w zwisie", sets: 3, reps: "10-15", note: "Zwisając na drążku, unoś kolana do klatki piersiowej bez huśtania", iconType: "hang", equipment: ["pullup_bar"] },
    { name: "Ściąganie łopatek w zwisie (scap pulls)", sets: 3, reps: "8-12", note: "Ze zwisu prostego unoś się kilka centymetrów samym ściągnięciem łopatek, bez zginania łokci", iconType: "hang", equipment: ["pullup_bar"] },
    { name: "Podciąganie łucznicze", sets: 3, reps: "4-6/stronę", note: "Podciągasz się bliżej jednej ręki, druga zostaje wyprostowana z boku", iconType: "pullupfront", equipment: ["pullup_bar"] },
    { name: "Podciąganie chwytem komandoskim", sets: 3, reps: "5-8", note: "Chwyt jedną ręką przed, drugą za drążkiem (w linii), podciągasz się z boku", iconType: "pullupfront", equipment: ["pullup_bar"] },
    { name: "Zwis L-sit", sets: 3, reps: "10-20s", note: "Ze zwisu unieś proste nogi do kąta prostego i utrzymaj — mocno angażuje brzuch", iconType: "hang", equipment: ["pullup_bar"] },
    { name: "Podciąganie szerokim chwytem", sets: 4, reps: "4-8", note: "Dłonie znacznie szerzej niż barki — mocniej pracują plecy szerokie", iconType: "pullupfront", equipment: ["pullup_bar"] },
    { name: "Podciąganie wąskim chwytem", sets: 3, reps: "5-8", note: "Dłonie blisko siebie, chwyt podchwytem — mocniej pracuje biceps", iconType: "pullupfront", equipment: ["pullup_bar"] },
    { name: "Zwis jednorącz wspomagany", sets: 3, reps: "10-15s/stronę", note: "Zwis głównie na jednej ręce, druga lekko odciąża trzymając nadgarstek", iconType: "hang", equipment: ["pullup_bar"] },
    { name: "Zwis prosty (aktywacja pleców)", sets: 3, reps: "20-30s", note: "Ramiona proste, lekko ściągnij łopatki w dół zamiast całkowicie się rozluźniać", iconType: "hang", equipment: ["pullup_bar"] },
    { name: "Martwy ciąg rumuński z gumą", sets: 4, reps: "10-12", note: "Stań na gumie, biodro cofaj do tyłu przy prawie prostych nogach, plecy proste", iconType: "row", equipment: ["band"] },
    { name: "Wiosłowanie w siadzie z gumą", sets: 4, reps: "10-12", note: "Gumę zaczep o stopy, siedząc ciągnij ją do brzucha, plecy proste", iconType: "row", equipment: ["band"] },
    { name: "Rotacja zewnętrzna barku z gumą", sets: 3, reps: "12-15/stronę", note: "Łokieć przy tułowiu pod kątem 90°, odwódź przedramię na zewnątrz, kontrolowany ruch", iconType: "facepull", equipment: ["band"] },
    { name: "Wiosłowanie hantlą", sets: 4, reps: "8-12/rękę", note: "Podparcie na ławce/kolanie, ciągnij hantlę do biodra, łokieć blisko ciała", iconType: "row", equipment: ["dumbbell"] },
    { name: "Uginanie ramion z hantlami", sets: 3, reps: "10-12", note: "Łokcie przy tułowiu, unikaj bujania się całym ciałem", iconType: "curl", equipment: ["dumbbell"] },
  ],
  legs: [
    { name: "Przysiad bułgarski", sets: 3, reps: "8-10/noga", note: "Tylna stopa oparta o podwyższenie, całość ciężaru na przedniej nodze", iconType: "lunge", equipment: ["bodyweight"] },
    { name: "Mostki biodrowe", sets: 3, reps: "15-20", note: "Leżąc na plecach, unoś biodra, na szczycie spinaj pośladki", iconType: "hip", equipment: ["bodyweight"] },
    { name: "Dead bug (stabilizacja brzucha)", sets: 3, reps: "10-12/stronę", note: "Leżąc na plecach, opuszczaj przeciwną rękę i nogę powoli, dolny odcinek pleców przyklejony do podłogi", iconType: "hip", equipment: ["bodyweight"] },
    { name: "Niedźwiedzie czołganie", sets: 3, reps: "20-30s", note: "Na czworakach z kolanami tuż nad podłogą, czołgaj się do przodu i w tył zachowując proste plecy", iconType: "plank", equipment: ["bodyweight"] },
    { name: "Burpees", sets: 3, reps: "8-12", note: "Przysiad, wyrzut nóg do deski, pompka, powrót, wyskok — pełne tempo", iconType: "plank", equipment: ["bodyweight"] },
    { name: "Pajacyki w desce (mountain climbers)", sets: 3, reps: "30-40s", note: "W podporze przodem naprzemiennie dociągaj kolana do klatki, szybkie tempo", iconType: "plank", equipment: ["bodyweight"] },
    { name: "Mostek biodrowy z gumą", sets: 3, reps: "15-20", note: "Guma nad kolanami, dociskaj kolana na zewnątrz podczas unoszenia bioder", iconType: "hip", equipment: ["band"] },
    { name: "Martwy ciąg z gumą", sets: 4, reps: "10-12", note: "Stań na gumie szeroko, prostuj się z biodra i kolan jednocześnie, plecy proste", iconType: "squat", equipment: ["band"] },
    { name: "Przysiad z hantlą (goblet squat)", sets: 4, reps: "10-12", note: "Trzymaj hantlę pionowo przy klatce piersiowej, siadaj głęboko między kolanami", iconType: "squat", equipment: ["dumbbell"] },
    { name: "Martwy ciąg rumuński z hantlami", sets: 4, reps: "10-12", note: "Hantle blisko nóg, biodro cofaj do tyłu, plecy proste przez cały ruch", iconType: "row", equipment: ["dumbbell"] },
    { name: "Wykroki chodzone z hantlami", sets: 3, reps: "10-12/noga", note: "Długi krok do przodu, kolano tylnej nogi blisko podłogi, naprzemiennie idź do przodu", iconType: "lunge", equipment: ["dumbbell"] },
  ],
  cardio: [
    { name: "Bieganie — tempo/interwały", sets: 1, reps: "20-30 min", note: "Rozgrzewka 5 min marszu przed startem", iconType: "run", equipment: ["running"] },
    { name: "Rower — spokojne tempo", sets: 1, reps: "25-35 min", note: "Tempo, przy którym swobodnie rozmawiasz", iconType: "bike", equipment: ["bike"] },
    { name: "Skakanka — interwały", sets: 6, reps: "1 min skakanki / 30s przerwy", note: "Lekkie odbicia z palców, łokcie blisko tułowia", iconType: "run", equipment: ["jump_rope"] },
    { name: "Skakanka — stałe tempo", sets: 1, reps: "10-15 min", note: "Równe, spokojne tempo bez przerw — dobre na rozgrzewkę lub cardio bazowe", iconType: "run", equipment: ["jump_rope"] },
  ],
  mobility: [
    { name: "Otwieranie barków z gumą (dislocates)", sets: 2, reps: "10-12", note: "Trzymając gumę szeroko oburącz, przenieś ją znad głowy za plecy z prostymi rękami", iconType: "pressoverhead", equipment: ["bodyweight", "band"] },
    { name: "Rozciąganie tyłu uda przy drążku", sets: 1, reps: "30-45s/noga", note: "Zaczep piętę o nisko ustawiony drążek/poręcz, pochyl się do przodu z prostymi plecami", iconType: "hamstring", equipment: ["bodyweight", "pullup_bar"] },
    { name: "Rozciąganie przodu uda w staniu", sets: 1, reps: "20-30s/noga", note: "Stojąc, chwyć stopę za sobą i przyciągnij piętę do pośladka, kolana blisko siebie", iconType: "hamstring", equipment: ["bodyweight"] },
    { name: "Skłon w siadzie", sets: 1, reps: "30-45s", note: "Siedząc z prostymi nogami, sięgaj do stóp z prostymi plecami", iconType: "hamstring", equipment: ["bodyweight"] },
    { name: "Rozciąganie w pozycji kobry", sets: 1, reps: "20-30s", note: "Leżąc przodem, unieś klatkę na wyprostowanych rękach, biodra zostają przy podłodze", iconType: "plank", equipment: ["bodyweight"] },
    { name: "Rozciąganie pośladka \"czwórka\"", sets: 1, reps: "30-45s/stronę", note: "Leżąc na plecach, kostkę jednej nogi połóż na kolanie drugiej i przyciągnij udo do klatki", iconType: "hip", equipment: ["bodyweight"] },
    { name: "Couch stretch z gumą (zginacze bioder)", sets: 1, reps: "30-45s/noga", note: "Tylna stopa wsparta wyżej (np. o ławkę), guma pomaga utrzymać biodro dociśnięte do przodu", iconType: "hipflex", equipment: ["bodyweight", "band"] },
    { name: "Rozciąganie nadgarstków i przedramion", sets: 1, reps: "20-30s/pozycję", note: "Dłoń wyprostowana, drugą ręką delikatnie dociągaj palce w górę i w dół", iconType: "curl", equipment: ["bodyweight"] },
    { name: "Mobilizacja karku", sets: 1, reps: "8-10 powt./kierunek", note: "Powolne skłony głowy w bok, w przód i delikatne rotacje — bez zadzierania głowy do tyłu", iconType: "thoracic", equipment: ["bodyweight"] },
    { name: "Rozciąganie najszerszego grzbietu na drążku", sets: 1, reps: "20-30s", note: "Chwyć drążek, ugnij kolana i osiądź biodrami w dół czując rozciąganie boków pleców", iconType: "hang", equipment: ["bodyweight", "pullup_bar"] },
  ],
};
