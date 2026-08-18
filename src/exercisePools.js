// Pools of interchangeable exercise variants. Each week, exercises tagged
// with a poolId (see defaultData.js) get swapped to a different entry from
// their pool by src/rotation.js. Names are chosen so icons.jsx keeps
// classifying them correctly (iconTypeFor keyword matches).
export const EXERCISE_POOLS = {
  spine_mobility: [
    { name: "Kocia-krowa (mobilizacja kręgosłupa)", sets: 1, reps: "10 powt.", note: "Na czworakach: wdech — głowa i miednica w górę, plecy uginają się w dół (krowa); wydech — głowę schowaj, plecy zaokrąglij w górę (kot)" },
    { name: "Rotacje kręgosłupa w klęku (nawlekanie igły)", sets: 1, reps: "8-10 / strona", note: "Na czworakach, jedną ręką „nawlecz” pod tułowiem, obracając klatkę piersiową w stronę podłogi, potem otwórz wysoko w górę" },
  ],
  chest_doorway: [
    { name: "Rozciąganie klatki w progu drzwi", sets: 1, reps: "30-45s", note: "Oba przedramiona oprzyj o framugę na wysokości barków, zrób mały krok w przód aż poczujesz ciągnięcie w klatce" },
    { name: "Rozciąganie klatki w progu drzwi (ręce wyżej)", sets: 1, reps: "30-45s", note: "Oba przedramiona oprzyj o framugę powyżej głowy — rozciąga inny fragment klatki piersiowej" },
  ],
  thoracic_rotation: [
    { name: "Rotacje piersiowego odcinka (leżąc na boku)", sets: 1, reps: "8-10 / strona", note: "Leżysz na boku, kolana złączone i ugięte — górną ręką otwieraj klatkę w stronę podłogi za sobą" },
    { name: "Rotacje piersiowego odcinka w klęku (nawlekanie igły)", sets: 1, reps: "8-10 / strona", note: "Klęk podparty, jedną ręką „nawlecz igłę” pod tułowiem, potem otwórz ją wysoko w górę śledząc wzrokiem dłoń" },
  ],
  hip_flexor: [
    { name: "Rozciąganie zginaczy biodra (klęk jednonóż)", sets: 1, reps: "30-45s / noga", note: "Klęk na jedno kolano, drugą stopę stawiasz z przodu — przesuń biodro do przodu, miednicę podkręć pod siebie" },
    { name: "Rozciąganie zginaczy biodra stojąc (wykrok)", sets: 1, reps: "30s / noga", note: "Długi wykrok w tył, tylna noga prosta i podparta na palcach — przesuń biodra do przodu" },
  ],
  hamstring_stretch: [
    { name: "Skłon do przodu — tył ud", sets: 1, reps: "30-45s", note: "Stojąc, kolana lekko ugięte, opuszczaj tułów w dół, ręce swobodnie w stronę stóp" },
    { name: "Rozciąganie tyłu uda na leżąco (unoszenie nogi)", sets: 1, reps: "30-45s / noga", note: "Leżąc na plecach, prostą nogę unieś w górę i przyciągnij do siebie za udo lub taśmą" },
  ],
  child_pose: [
    { name: "Pozycja dziecka", sets: 1, reps: "45-60s", note: "Klęk, biodra opuść w stronę pięt, ręce wyciągnięte daleko przed sobą na podłodze" },
    { name: "Pozycja dziecka z wyciągniętymi rękami na bok", sets: 1, reps: "30-45s / strona", note: "Z pozycji dziecka przełóż jedną rękę daleko w bok pod tułów — poczujesz rozciąganie boku i barku" },
  ],
  lateral_raise_variant: [
    { name: "Wznosy boczne z gumą", sets: 3, reps: "12-15", note: "Unoś do wysokości barków, bez szarpania" },
    { name: "Wznosy boczne z gumą jednorącz", sets: 3, reps: "12-15 / ręka", note: "Wolniejsze tempo, skup się na jednej stronie na raz" },
  ],
  hang_variant: [
    { name: "Zwis na drążku (mobilność barków)", sets: 3, reps: "20-30s", note: "Rozluźnij barki, oddychaj spokojnie" },
    { name: "Zwis aktywny z podciąganiem łopatek", sets: 3, reps: "8-10 powt.", note: "Ze zwisu ściągaj łopatki w dół, unosząc się lekko, bez zginania łokci" },
  ],
  plank_variant: [
    { name: "Plank (bez dociążenia)", sets: 3, reps: "20-40s", note: "Biodra w linii ciała, brzuch ściągnięty" },
    { name: "Plank boczny (stabilizacja bocznych mięśni brzucha)", sets: 3, reps: "15-30s / strona", note: "Podparcie na jednym przedramieniu, biodro uniesione w linii ciała" },
  ],
  pushup_tempo_variant: [
    { name: "Pompki tempo 3-1-1", sets: 3, reps: "do odmowy", note: "3s w dół, 1s przerwy, 1s w górę" },
    { name: "Pompki z przerwą w dolnej pozycji", sets: 3, reps: "6-10", note: "2s pauzy tuż nad podłogą w każdym powtórzeniu" },
  ],
  hammer_curl_variant: [
    { name: "Uginanie młotkowe z gumą", sets: 3, reps: "12-15", note: "Chwyt neutralny, kciuki do góry" },
    { name: "Uginanie ramion chwytem odwrotnym", sets: 3, reps: "10-12", note: "Chwyt od góry (pronacja) — mocniej pracuje przedramię" },
  ],
};
