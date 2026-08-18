export const uid = () => Math.random().toString(36).slice(2, 9);

export function defaultDays() {
  return [
    { id: uid(), title: "Push A — klatka / barki / triceps", tag: "SIŁA", exercises: [
      { id: uid(), name: "Pompki (lub na kolanach)", sets: 4, reps: "8-12", note: "Łokcie ok. 45° od tułowia, ciało w linii prostej" },
      { id: uid(), name: "Wyciskanie gumą nad głowę", sets: 4, reps: "10-12", note: "Nie blokuj pleców w łuk, brzuch spięty" },
      { id: uid(), name: "Rozpiętki z gumą", sets: 3, reps: "12-15", note: "Lekko ugięte łokcie przez cały ruch" },
      { id: uid(), name: "Pompki diamentowe (triceps)", sets: 3, reps: "8-10", note: "Dłonie razem pod klatką, łokcie blisko ciała" },
      { id: uid(), name: "Wznosy boczne z gumą", sets: 3, reps: "12-15", note: "Unoś do wysokości barków, bez szarpania", poolId: "lateral_raise_variant" },
    ]},
    { id: uid(), title: "Pull A — plecy / biceps", tag: "SIŁA", exercises: [
      { id: uid(), name: "Podciąganie nachwytem", sets: 5, reps: "3-8", note: "Zaczynaj z pełnego zwisu, łopatki w dół" },
      { id: uid(), name: "Wiosłowanie gumą w opadzie", sets: 4, reps: "10-12", note: "Plecy proste, łokieć ciągnij do biodra" },
      { id: uid(), name: "Podciąganie podchwytem (biceps)", sets: 3, reps: "5-8", note: "Kontrolowany opust, bez huśtania" },
      { id: uid(), name: "Uginanie ramion z gumą", sets: 3, reps: "12-15", note: "Łokcie przy tułowiu przez cały ruch" },
      { id: uid(), name: "Zwis na drążku (mobilność barków)", sets: 3, reps: "20-30s", note: "Rozluźnij barki, oddychaj spokojnie", poolId: "hang_variant" },
    ]},
    { id: uid(), title: "Nogi / Core + rower spokojny", tag: "NOGI", exercises: [
      { id: uid(), name: "Przysiad z gumą (stopy na szer. bioder)", sets: 4, reps: "10-12", note: "Kolana w linii stóp, biodro cofnij jak na krzesło" },
      { id: uid(), name: "Wykroki w miejscu", sets: 3, reps: "8-10/noga", note: "Krok umiarkowany — bez maksymalnego rozkroku" },
      { id: uid(), name: "Hip thrust / unoszenie bioder", sets: 3, reps: "12-15", note: "Na szczycie spinaj pośladki, nie odginaj lędźwi" },
      { id: uid(), name: "Plank (bez dociążenia)", sets: 3, reps: "20-40s", note: "Biodra w linii ciała, brzuch ściągnięty", poolId: "plank_variant" },
      { id: uid(), name: "Rower — spokojne tempo", sets: 1, reps: "25-35 min", note: "Tempo, przy którym swobodnie rozmawiasz" },
    ]},
    { id: uid(), title: "Push B — klatka / barki / triceps", tag: "WYGLĄD", exercises: [
      { id: uid(), name: "Pompki z nogami na podwyższeniu", sets: 4, reps: "8-12", note: "Większy zakres, kontroluj tempo w dół" },
      { id: uid(), name: "Wyciskanie gumą przed sobą", sets: 4, reps: "12-15", note: "Wydech przy wypchnięciu, łopatki stabilne" },
      { id: uid(), name: "Francuskie z gumą (triceps)", sets: 3, reps: "12-15", note: "Łokcie nieruchome, pracuje tylko przedramię" },
      { id: uid(), name: "Wznosy przodem z gumą", sets: 3, reps: "12-15", note: "Do wysokości oczu, bez bujania tułowiem" },
      { id: uid(), name: "Pompki tempo 3-1-1", sets: 3, reps: "do odmowy", note: "3s w dół, 1s przerwy, 1s w górę", poolId: "pushup_tempo_variant" },
    ]},
    { id: uid(), title: "Pull B + bieganie", tag: "WYGLĄD", exercises: [
      { id: uid(), name: "Podciąganie neutralnym chwytem", sets: 4, reps: "5-8", note: "Dłonie równoległe, ciągnij łokciami w dół" },
      { id: uid(), name: "Wiosłowanie gumą jednorącz", sets: 3, reps: "10-12/ręka", note: "Nie skręcaj tułowia podczas ciągnięcia" },
      { id: uid(), name: "Face pull z gumą", sets: 3, reps: "15-20", note: "Łokcie wysoko, ciągnij do twarzy" },
      { id: uid(), name: "Uginanie młotkowe z gumą", sets: 3, reps: "12-15", note: "Chwyt neutralny, kciuki do góry", poolId: "hammer_curl_variant" },
      { id: uid(), name: "Bieganie — tempo/interwały", sets: 1, reps: "20-30 min", note: "Rozgrzewka 5 min marszu przed startem" },
    ]},
    { id: uid(), title: "Rozciąganie — codziennie (10-15 min)", tag: "MOBILNOŚĆ", exercises: [
      { id: uid(), name: "Kocia-krowa (mobilizacja kręgosłupa)", sets: 1, reps: "10 powt.", note: "Na czworakach: wdech — głowa i miednica w górę, plecy uginają się w dół (krowa); wydech — głowę schowaj, plecy zaokrąglij w górę (kot)", poolId: "spine_mobility" },
      { id: uid(), name: "Rozciąganie klatki w progu drzwi", sets: 1, reps: "30-45s", note: "Oba przedramiona oprzyj o framugę na wysokości barków, zrób mały krok w przód aż poczujesz ciągnięcie w klatce", poolId: "chest_doorway" },
      { id: uid(), name: "Rotacje piersiowego odcinka (leżąc na boku)", sets: 1, reps: "8-10 / strona", note: "Leżysz na boku, kolana złączone i ugięte — górną ręką otwieraj klatkę w stronę podłogi za sobą", poolId: "thoracic_rotation" },
      { id: uid(), name: "Rozciąganie zginaczy biodra (klęk jednonóż)", sets: 1, reps: "30-45s / noga", note: "Klęk na jedno kolano, drugą stopę stawiasz z przodu — przesuń biodro do przodu, miednicę podkręć pod siebie", poolId: "hip_flexor" },
      { id: uid(), name: "Skłon do przodu — tył ud", sets: 1, reps: "30-45s", note: "Stojąc, kolana lekko ugięte, opuszczaj tułów w dół, ręce swobodnie w stronę stóp", poolId: "hamstring_stretch" },
      { id: uid(), name: "Pozycja dziecka", sets: 1, reps: "45-60s", note: "Klęk, biodra opuść w stronę pięt, ręce wyciągnięte daleko przed sobą na podłodze", poolId: "child_pose" },
    ]},
  ];
}
