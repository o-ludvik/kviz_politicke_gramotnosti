# Kolik to stálo stát? Podklady a zdroje ke kvízu

Stav k 3. 10. 2026. Kauzy od roku 2015.

Tento dokument je jediný zdroj faktů pro kvíz „Kolik to stálo stát?“. Webová aplikace z něj přebírá názvy, věty, aktéry, částky, správné pořadí, podrobné popisy i zdroje. Nic dalšího se nedomýšlí. Čísla v hranatých závorkách [n] odkazují na zdroje uvedené u každé kauzy; číslování je společné pro celý dokument.

## Co se oproti první verzi změnilo

- Vyřazeny kauzy, které vznikly před rokem 2015: solární boom (2009–2010), tunel Blanka, privatizace OKD (2004), ProMoPro (2009), letouny CASA (2009) a Opencard (2012).
- Po vyřazení zbylo devět kauz, proto přibyla kauza sportovních dotací (2017), pravomocně uzavřená v květnu 2025.
- Čapí hnízdo zůstává, přestože dotace byla vyplacena v roce 2008: trestní stíhání běží od roku 2017 a pravomocný rozsudek nad Janou Nagyovou padl v srpnu 2026. Pokud chcete pravidlo „od 2015“ uplatnit striktně podle data činu, nahraďte ho záložní kauzou eDálnice (viz konec dokumentu).
- U Agrofertu je doplněn pozdější odhad: ministr Výborný v srpnu 2025 mluvil o 5,1 mld. Kč, v září 2025 odhad zvýšil na víc než 7 mld. Kč.

## Metodika řazení

- Kritérium: nejlepší dostupné veřejné vyčíslení toho, kolik kauza stála veřejné rozpočty. U každé kauzy je uvedeno, o jaký rozpočet jde (státní, obecní, rozpočet EU).
- Pořadí důvěryhodnosti vyčíslení: pravomocný rozsudek, kontrola NKÚ, údaje ministerstva nebo úřadu, obžaloba nebo policie, odhady médií.
- Kauzy bez prokázané škody (peníze vráceny, čin zůstal ve stadiu pokusu, škoda neprokázána) mají hodnotu 0 Kč a sdílejí 7. místo. Na jejich vzájemném pořadí nezáleží.
- Kauza, na které stát peníze získal, je poslední.
- Každá částka má typ, tedy co číslo znamená. Bez typu se částka nesmí zobrazit.

## Správné pořadí (řešení)

V aplikaci se tato tabulka ani pořadí nesmí zobrazit před vyřešením kvízu. Hodnota `rank` používá soutěžní číslování: tři kauzy na 7. místě, další kauza je 10.

| rank | Kauza | Částka | Typ částky | sortValue (Kč) |
|---|---|---|---|---|
| 1 | Covidové nákupy ochranných pomůcek | 8,5 mld. Kč | výdaje podle NKÚ | 8 500 000 000 |
| 2 | Dotace Agrofertu a střet zájmů | 5,1–7 mld. Kč | sporná částka | 5 100 000 000 |
| 3 | Digitalizace stavebního řízení | 215–330 mil. Kč | přímé výdaje | 215 000 000 |
| 4 | Frakce ID v Evropském parlamentu | ≈ 105 mil. Kč (4,3 mil. €) | podezření, peníze EU | 105 000 000 |
| 5 | Motol | 85 mil. Kč | tvrzení policie | 85 000 000 |
| 6 | Stoka | 49 mil. Kč | nárok poškozeného | 49 000 000 |
| 7 | Čapí hnízdo | ≈ 0 Kč | vráceno | 0 |
| 7 | Dozimetr | škoda neprokázána | neprokázáno | 0 |
| 7 | Sportovní dotace | 0 Kč | pokus, škoda nevznikla | 0 |
| 10 | Bitcoinová kauza | +956,8 mil. Kč pro stát | příjem státu | −956 800 000 |

Hodnota `sortValue` je jen informativní. Správné pořadí určuje výhradně `rank`.

Kde je pořadí sporné:
- Covid vs. Agrofert: u covidu jde o celkové výdaje za skutečně dodané zboží (přeplacení nikdo nevyčíslil), u Agrofertu o dotace, které stát chtěl zpět a dnes je převážně nevymáhá. Pořadí stojí na zobrazených číslech a jejich typ je u obou výslovně uveden.
- Stoka: státní zástupce odhadoval celkovou škodu až na půl miliardy korun, což by Stoku posunulo na 3. místo. Používáme konkrétní částku uplatněnou poškozenou radnicí (49 mil. Kč).
- Frakce ID: jde o peníze z rozpočtu EU, ne z českého státního rozpočtu, a o podezření, ne zjištěnou škodu.

## Politický kontext k říjnu 2026

- Sněmovní volby v říjnu 2025 vyhrálo ANO. Vládu tvoří ANO, SPD a Motoristé sobě; prezident jmenoval třetí vládu Andreje Babiše 15. 12. 2025 [57][58].
- Adam Vojtěch (ANO) je znovu ministrem zdravotnictví [58].
- V opozici jsou ODS, STAN, Piráti, KDU-ČSL a TOP 09.

Zdroje ke kontextu:
- [57] ČT24: Prezident jmenoval vládu Andreje Babiše. https://ct24.ceskatelevize.cz/clanek/domaci/pavel-jmenuje-babisovu-vladu-368166
- [58] E15: Přehledně: Noví ministři vlády Andreje Babiše. https://www.e15.cz/ministri-nova-vlada

Zastoupení stran v sadě (pro autora, v aplikaci se nezobrazuje):
- ANO: Dotace Agrofertu, Čapí hnízdo, Stoka, Covidové nákupy (Vojtěch), Digitalizace (Dostálová, okrajově).
- ČSSD/SOCDEM: Covidové nákupy (Hamáček), Sportovní dotace (ministerstvo vedené Valachovou).
- ODS: Bitcoinová kauza, Dozimetr (Šnajdr ve vedlejší větvi).
- STAN: Dozimetr.
- Piráti: Digitalizace stavebního řízení.
- SPD: Frakce ID (jen jako člen frakce, nikdo z SPD obviněn není).
- Bez stranické vazby: Motol.
- KDU-ČSL, TOP 09, Motoristé a Stačilo!/KSČM v podkladech nemají kauzu z let 2015+ s vyčíslitelnými náklady.

---

## Karty kauz

Karty jsou seřazené abecedně, nikoli podle řešení. Ve stejném pořadí se v aplikaci zobrazují skupiny zdrojů.

### Bitcoinová kauza

- **id:** `bitcoin`
- **Období:** 2025–2026
- **rank:** 10
- **Jedna věta (před odhalením, bez částky):** Ministerstvo spravedlnosti přijalo darem bitcoiny od muže, který byl odsouzen za provozování nelegálního tržiště na darknetu.
- **Klíčoví aktéři:**
  - Pavel Blažek – tehdejší ministr spravedlnosti (ODS, ze strany po kauze odešel)
  - Tomáš Jiřikovský – dárce bitcoinů, dříve odsouzený provozovatel tržiště Nucleus Market
  - Radomír Daňhel – bývalý vysoký úředník ministerstva
  - Kárim Titz – advokát
- **Částka:** +956,8 mil. Kč pro stát
- **Typ částky:** příjem státu
- **Vysvětlení částky:** Tolik ministerstvo utržilo prodejem darovaných bitcoinů. Případné náklady kauzy nikdo nevyčíslil.
- **Podrobný popis:**
  - V březnu 2025 přijalo ministerstvo spravedlnosti dar 468 bitcoinů od Tomáše Jiřikovského [1]. Ministerstvo je prodalo v 78 aukcích a do státního majetku tak přibylo 956,8 milionu korun [2].
  - Po zveřejnění daru ministr Pavel Blažek rezignoval a odešel z ODS. Podle obžaloby šlo o legalizaci výnosů z trestné činnosti, tedy o praní špinavých peněz [5][6]. Policie v roce 2026 obvinila Blažka a další dva lidi [3][4]. Část kauzy týkající se vrácení počítačů Jiřikovskému policie odložila [7].
- **Právní stav k 3. 10. 2026:** Vrchní státní zastupitelství v Olomouci podalo 31. 7. 2026 obžalobu ke Krajskému soudu v Brně. Navrhuje 6,5 roku vězení pro Blažka i Daňhela, 8 let pro Titze a 20 let souhrnného trestu pro Jiřikovského [5][6]. Blažek vinu odmítá. Rozsudek zatím nepadl, platí presumpce neviny.
- **Zdroje:**
  - [1] Česká justice (5/2025): Ministerstvo spravedlnosti získalo bitcoiny za miliardu od obchodníka s drogami. https://www.ceska-justice.cz/2025/05/ministerstvo-spravedlnosti-ziskalo-bitcoiny-za-miliardu-od-obchodnika-s-drogami/
  - [2] FXstreet.cz: Ministerstvo spravedlnosti letos prodalo v aukcích bitcoiny za skoro miliardu. https://www.fxstreet.cz/ministerstvo-spravedlnosti-letos-prodalo-v-aukcich-bitcoiny-za-skoro-miliardu.html
  - [3] Deník N: Bitcoinová kauza: Policie obvinila Blažka i jeho náměstka. https://denikn.cz/2053379/bitcoinova-kauza-policie-obvinila-blazka-i-jeho-namestka/
  - [4] Česká justice (5/2026): Exministr Blažek obviněný kvůli bitcoinům. Policie ukázala na tři lidi. https://www.ceska-justice.cz/2026/05/exministr-blazek-bitcoiny-policie-obvinila/
  - [5] Česká justice (8/2026): 6 a půl roku pro exministra Blažka. Žalobkyně navrhla tresty v bitcoinové kauze. https://www.ceska-justice.cz/2026/08/6-a-pul-roku-pro-exministra-blazka-bitcoiny-obzaloba/
  - [6] Transparency International ČR: Kauza bitcoin míří k soudu. Mezi obžalovanými je i exministr Blažek. https://www.transparency.cz/kauza-bitcoin-miri-k-soudu-mezi-obzalovanymi-je-i-exministr-blazek/
  - [7] Seznam Zprávy: Kauza Bitcoin: Vrácení počítačů Jiřikovskému nebyl zločin. https://www.seznamzpravy.cz/clanek/domaci-kauzy-kauza-bitcoin-vraceni-pocitacu-jirikovskemu-nebyl-zlocin-300304
  - [8] Wikipedie: Bitcoinová kauza. https://cs.wikipedia.org/wiki/Bitcoinov%C3%A1_kauza

### Covidové nákupy ochranných pomůcek

- **id:** `covid-nakupy`
- **Období:** 2020
- **rank:** 1
- **Jedna věta:** Na jaře 2020 nakupovala ministerstva respirátory a roušky bez soutěží, každé na vlastní pěst a za velmi rozdílné ceny.
- **Klíčoví aktéři:**
  - Adam Vojtěch – tehdejší ministr zdravotnictví (ANO), dnes opět ministr zdravotnictví
  - Jan Hamáček – tehdejší ministr vnitra (ČSSD)
- **Částka:** 8,5 mld. Kč
- **Typ částky:** výdaje podle NKÚ
- **Vysvětlení částky:** Tolik obě ministerstva v roce 2020 zaplatila za ochranné pomůcky v nákupech, které NKÚ označil za chaotické. Kolik z toho bylo přeplaceno, nikdo nevyčíslil.
- **Podrobný popis:**
  - Nejvyšší kontrolní úřad zjistil, že ministerstva zdravotnictví a vnitra od ledna do srpna 2020 utratila za ochranné pomůcky včetně dopravy celkem 8,5 miliardy korun [9][11]. Nákupy podle kontrolorů probíhaly bez koordinace, ceny se výrazně lišily a respirátory FFP2 kupovalo ministerstvo zdravotnictví až za 777 korun za kus [10][11]. Část pomůcek neměla potřebné certifikáty [9].
  - Ministerstvo vnitra navíc předalo 1,8 milionu kusů pomůcek z daru skupin J&T a EPH soukromé firmě, aniž smluvně zajistilo veřejný zájem. Dovoz stál stát téměř 7 milionů korun a NKÚ tuto část předal policii [12]. Ministerstva se hájila tím, že v krizi musela nakupovat rychle [10].
- **Právní stav k 3. 10. 2026:** Obžalobu ani odsouzení související s nákupy se nepodařilo dohledat. Jde o zjištění kontroly NKÚ, ne o soudem prokázanou škodu.
- **Zdroje:**
  - [9] iROZHLAS: Závěr kontrolního úřadu: ministerstva 10 let podceňovala hrozby epidemií, nákupy byly chaotické. https://www.irozhlas.cz/zpravy-domov/kontrola-nejvyssi-kontrolni-urad-nakup-rousek-ministerstvo-zdravotnictvi_2103220715_vtk
  - [10] Frekvence 1: Audit odhalil předražené respirátory, Hamáček se brání. https://www.frekvence1.cz/clanky/podle-nku-ministerstva-nakupovala-predrazene-respiratory-vnitro-muselo-pomucky-nakoupit-rychle-brani-se-hamacek.shtml
  - [11] Blesk: Respirátory a další pomůcky: Nákup státem provázel chaos, upozornil NKÚ. https://www.blesk.cz/clanek/zpravy-koronavirus/673029/statni-chaos-a-respiratory-i-za-777-kc-za-kus-rozkryla-kontrola-nku-babis-kritiku-odmitl.html
  - [12] Seznam Zprávy: Ať mě zavřou, jestli v tom byla chyba, hájí Hamáček dar od miliardářů. https://www.seznamzpravy.cz/clanek/at-me-zavrou-jestli-byla-chyba-vysvetluje-hamacek-dar-od-miliardaru-148067
  - TODO: doplnit přímý odkaz na kontrolní závěr NKÚ z kontrolní akce 20/32 (nku.cz) jako primární zdroj.

### Čapí hnízdo

- **id:** `capi-hnizdo`
- **Období:** dotace 2008, trestní řízení 2017–2026
- **rank:** 7
- **Jedna věta:** Farma Čapí hnízdo dostala dotaci určenou malým a středním podnikům; podle obžaloby k tomu byla účelově vyvedena z holdingu Agrofert.
- **Klíčoví aktéři:**
  - Andrej Babiš – zakladatel Agrofertu, předseda ANO, dnes premiér (stíhání je pozastaveno, vina mu nebyla prokázána)
  - Jana Nagyová – dlouholetá Babišova spolupracovnice, dnes europoslankyně za ANO (pravomocně odsouzena)
- **Částka:** ≈ 0 Kč (49,96 mil. Kč vráceno)
- **Typ částky:** vráceno
- **Vysvětlení částky:** Dotaci zhruba 50 milionů korun firma Imoba v roce 2018 vrátila, čistý dopad na veřejné rozpočty je tedy přibližně nulový.
- **Podrobný popis:**
  - Farma u Olbramovic na Benešovsku získala v roce 2008 dotaci zhruba 50 milionů korun z programu pro malé a střední podniky. Podle obžaloby vznikla škoda 49,9 milionu korun, z toho 42,5 milionu šlo z rozpočtu EU a po 3,7 milionu ze státního rozpočtu a z rozpočtu Středočeského kraje [15].
  - Firma Imoba z holdingu Agrofert v červnu 2018 vrátila celkem 49 960 256 korun [13][14]. Na průběh trestního řízení to vliv nemělo [13].
- **Právní stav k 3. 10. 2026:** Jana Nagyová dostala 4. 5. 2026 tříletou podmínku a peněžitý trest 500 tisíc korun; senát přitom byl vázán názorem odvolacího soudu [16]. Vrchní soud v Praze rozsudek 31. 8. 2026 potvrdil, je pravomocný a zbývá možnost dovolání [17]. Sněmovna 5. 3. 2026 Andreje Babiše k trestnímu stíhání nevydala, jeho stíhání je po dobu mandátu pozastaveno a vina mu prokázána nebyla [17][18].
- **Zdroje:**
  - [13] Aktuálně.cz: Imoba vrátila padesátimilionovou dotaci na Čapí hnízdo. Na Babišovo stíhání to nemá vliv. https://zpravy.aktualne.cz/domaci/imoba-vratila-padesatimilionovou-dotaci-na-capi-hnizdo-na-ba/r~fcd668d07b7411e8a105ac1f6b220ee8/
  - [14] iROZHLAS: Imoba vrátila 50milionovou dotaci na farmu Čapí hnízdo, většina peněz půjde do státního rozpočtu. https://www.irozhlas.cz/zpravy-domov/capi-hnizdo-imoba-dotace-vraceni_1806291003_ako
  - [15] ČTK / České noviny: Obžaloba: Babiš zajistil vytvoření podmínek na dotaci pro Čapí hnízdo. https://www.ceskenoviny.cz/zpravy/obzaloba-babis-zajistil-vytvoreni-podminek-na-dotaci-pro-capi-hnizdo/2230323
  - [16] ČTK / České noviny (5/2026): Nagyová dostala v kauze Čapí hnízdo podmínku a trest půl milionu korun. https://www.ceskenoviny.cz/zpravy/2798827
  - [17] Česká justice (8/2026): Podmínka a půlmilionový trest pro Nagyovou. Rozhodnutí v kauze Čapí hnízdo je pravomocné. https://www.ceska-justice.cz/2026/08/podminka-a-pulmilionovy-trest-pro-nagyovou-capi-hnizdo/
  - [18] Wikipedie: Kauza Čapí hnízdo. https://cs.wikipedia.org/wiki/Kauza_%C4%8Cap%C3%AD_hn%C3%ADzdo

### Digitalizace stavebního řízení

- **id:** `digitalizace-stavebniho-rizeni`
- **Období:** 2018–2025, spuštění v červenci 2024
- **rank:** 3
- **Jedna věta:** Systémy pro digitální stavební řízení byly v červenci 2024 spuštěny, přestože nefungovaly, a odpovědný ministr kvůli tomu přišel o funkci.
- **Klíčoví aktéři:**
  - Ivan Bartoš – ministr pro místní rozvoj do podzimu 2024 (Piráti)
  - Klára Dostálová – ministryně pro místní rozvoj 2017–2021 (ANO); audit jí přičítá část zpoždění, ona to odmítá
- **Částka:** 215–330 mil. Kč
- **Typ částky:** přímé výdaje
- **Vysvětlení částky:** Tolik podle ministerstva stál nefunkční systém. Ztráty firem a možné sankce z EU v částce nejsou.
- **Podrobný popis:**
  - Portál stavebníka a navazující systémy spustilo ministerstvo pro místní rozvoj v červenci 2024, ale nefungovaly. Ivan Bartoš byl na podzim 2024 kvůli tomu odvolán. Audit zadaný jeho nástupcem Petrem Kulhánkem (za STAN) našel 32 klíčových problémů a část chyb připsal už vedení ministerstva za Kláry Dostálové, která to odmítá [19][20].
  - Přímé výdaje podle Kulhánka činily asi 215 milionů korun, podle Bartoše zhruba 330 milionů z plánovaných 650 milionů [20][21]. Úřad pro ochranu hospodářské soutěže uložil ministerstvu pokutu 1 milion korun.
  - Odhady rizik jsou mnohem vyšší: Česku hrozí ztráta až 13,7 miliardy korun z Národního plánu obnovy [22] a ekonom Lukáš Kovanda odhadl škody pro ekonomiku na zhruba 2 miliardy korun jen za léto 2024 [23]. Tyto částky ale nejsou přímé výdaje státu.
- **Právní stav k 3. 10. 2026:** Bylo podáno několik trestních oznámení, nikdo obviněn není. NKÚ kontrolu odložil kvůli šetření Evropské komise a forenznímu auditu [24]. Vláda Andreje Babiše posunula termín digitalizace na konec roku 2030 [25].
- **Zdroje:**
  - [19] ČT24: Chyboval Bartoš a před ním i Dostálová, tvrdí audit digitalizace. https://ct24.ceskatelevize.cz/clanek/domaci/digitalizace-mela-zpozdeni-uz-za-dostalove-tvrdi-audit-ta-to-odmita-360164
  - [20] Echo24: Žalostný pokus o digitalizaci stavebního řízení vyšel firmy draho. Kulhánek hází odpovědnost na minulou vládu. https://m.echo24.cz/a/HyXjC/zpravy-domaci-digitalizace-stavebni-rizeni-bartos-pirati-audit-kulhanek-ano
  - [21] Fintag: Digitalizace stavebního řízení stála 330 milionů. Do hry vstupuje NKÚ. https://www.fintag.cz/2024/12/27/nefunkcni-digitalizace-stavebniho-rizeni-stala-330-milionu-do-hry-vstupuje-nku/
  - [22] ASB-portál: Digitalizace stavebního řízení pod lupou. Hrozí Česku miliardové sankce? https://www.asb-portal.cz/aktualne/digitalizace-stavebniho-rizeni-pod-lupou-hrozi-cesku-miliardove-sankce
  - [23] Kurzy.cz: Fiasko digitalizace stavebního řízení zatím českou ekonomiku připravilo o takřka dvě miliardy korun. https://zpravy.kurzy.cz/781350-fiasko-digitalizace-stavebniho-rizeni-zatim-ceskou-ekonomiku-pripravilo-o-takrka-dve-miliardy-korun/
  - [24] Aktuálně.cz: NKÚ se zatím nebude zabývat digitalizací stavebního řízení. https://zpravy.aktualne.cz/domaci/nku-se-zatim-nebude-zabyvat-digitalizaci-stavebniho-rizeni/r~009c6fb0d67111efb589ac1f6b220ee8/
  - [25] Česká justice (12/2025): Stát to znovu nezvládl. Vláda odkládá digitalizaci stavebního řízení až do roku 2030. https://www.ceska-justice.cz/2025/12/vlada-odklada-digitalizaci-stavebniho-rizeni-do-roku-2030/
  - TODO: doplnit zdroj k pokutě ÚOHS (1 mil. Kč), nebo větu z popisu vypustit.

### Dotace Agrofertu a střet zájmů

- **id:** `agrofert-dotace`
- **Období:** dotace 2017–2021, spor 2025–2026
- **rank:** 2
- **Jedna věta:** Firmy holdingu Agrofert pobíraly dotace v letech, kdy byl jejich zakladatel Andrej Babiš premiérem; podle ministerstva zemědělství to bylo ve střetu zájmů.
- **Klíčoví aktéři:**
  - Andrej Babiš – zakladatel holdingu Agrofert, předseda ANO, premiér v letech 2017–2021 a znovu od prosince 2025
  - Holding Agrofert – zhruba 90 firem, kterých se vymáhání týkalo
- **Částka:** 5,1–7 mld. Kč
- **Typ částky:** sporná částka
- **Vysvětlení částky:** Tolik chtělo ministerstvo zemědělství v roce 2025 zpět. V dubnu 2026 státní fond vymáhání většiny těchto dotací zastavil.
- **Podrobný popis:**
  - V srpnu 2025 oznámil ministr zemědělství Marek Výborný (KDU-ČSL), že stát bude po zhruba 90 firmách holdingu vymáhat 5,1 miliardy korun z dotací za roky 2017–2021; největší část, asi 4,24 miliardy, tvořily evropské nárokové platby na plochu [26]. V září 2025 odhad zvýšil na víc než 7 miliard, protože započítal i dotace vyplácené přímo ministerstvem. Agrofert tvrdil, že k vracení není důvod [27].
  - V dubnu 2026 Státní zemědělský intervenční fond rozhodl, že nárokové dotace vymáhat nebude, protože se na ně podle jeho analýz zákon o střetu zájmů nevztahuje. Definitivně odebral jen 8 projektů za 68 milionů korun a národní dotace za zhruba 1 miliardu dál prověřuje [28][29].
  - Evropská komise výdaje spojené s Agrofertem neproplácí, dokud střet zájmů neposoudí; jde například o 204,7 milionu korun za květen 2026 [30][31]. Pokud je Komise neproplatí, zůstanou na českém státním rozpočtu. Ověřovatelé z Demagog.cz upozorňují, že u nárokových dotací nelze z veřejných zdrojů s jistotou určit, zda byly vyplaceny neoprávněně [33].
- **Právní stav k 3. 10. 2026:** Jde o správní spor, ne o trestní řízení. O vrácení peněz pravomocně rozhodnuto nebylo a Evropská komise střet zájmů dál posuzuje [30][32].
- **Zdroje:**
  - [26] ČT24 (8/2025): Resort bude po Agrofertu vymáhat dotace ve výši 5,1 miliardy, řekl Výborný. https://ct24.ceskatelevize.cz/clanek/domaci/ministerstvo-bude-po-agrofertu-vymahat-dotace-ve-vysi-51-miliardy-rekl-vyborny-364416
  - [27] iROZHLAS (9/2025): Výborného ministerstvo bude chtít po Agrofertu přes sedm miliard. Holding tvrdí, že k tomu není důvod. https://www.irozhlas.cz/zpravy-domov/ministerstvo-bude-chtit-po-agrofertu-pres-sedm-miliard-vyborny-puvodne-zminoval_2509181057_ntu
  - [28] Česká justice (4/2026): Miliardy zůstávají v Agrofertu: Fond zastavil vymáhání dotací, Babiš mluví o udavačích. https://www.ceska-justice.cz/2026/04/miliardy-zustavaji-v-agrofertu-babis-mluvi-o-udavacich/
  - [29] ČT24: Fond prověřuje kvůli možnému střetu zájmů dotace pro Agrofert za miliardu. https://ct24.ceskatelevize.cz/clanek/domaci/fond-proveruje-kvuli-moznemu-stretu-zajmu-dotace-pro-agrofert-za-miliardu-372869
  - [30] ČTK / České noviny: EK: České úřady mohly obnovit dotace firmám z Agrofertu, EU zatím nic neproplácí. https://www.ceskenoviny.cz/zpravy/ek-ceske-urady-mohly-obnovit-dotace-firmam-z-agrofertu-eu-zatim-nic-neproplaci/2824242
  - [31] ČTK / České noviny: SZIF zaslal EK zprávu o dotacích vyplacených Agrofertu za 204 mil. Kč. https://www.ceskenoviny.cz/zpravy/zemedelsky-fond-zaslal-ek-zpravu-o-dotacich-vyplacenych-agrofertu-za-204-mil-kc/2836367
  - [32] CEDMO: Dotace pro Agrofert, soudy a Evropská komise. https://cedmohub.eu/cs/dotace-pro-agrofert-soudy-a-evropska-komise/
  - [33] Demagog.cz: ověření výroku „Sedm miliard jste neoprávněně vyplatil Agrofertu“. https://demagog.cz/vyrok/24303

### Dozimetr

- **id:** `dozimetr`
- **Období:** odhaleno v červnu 2022, soud od roku 2025
- **rank:** 7
- **Jedna věta:** Podle obžaloby skupina kolem lobbisty dosazovala manažery do pražského dopravního podniku a za úplatky ovlivňovala jeho zakázky.
- **Klíčoví aktéři:**
  - Michal Redl – podnikatel a lobbista, podle obžaloby vůdce skupiny; byl napojený na STAN
  - Petr Hlubuček – bývalý náměstek pražského primátora a místopředseda STAN, hnutí ho vyloučilo
  - Pavel Kos – podle obžaloby člen skupiny, vinu uznal
  - Marek Šnajdr – exposlanec ODS, obžalovaný ve vedlejší větvi o zakázce VZP
- **Částka:** Škoda neprokázána
- **Typ částky:** neprokázáno
- **Vysvětlení částky:** Dopravní podnik u soudu škodu nevyčíslil ani neprokázal, proto ho soud nepřijal jako poškozeného.
- **Podrobný popis:**
  - Policie kauzu odhalila v červnu 2022. Podle obžaloby skupina kolem Michala Redla systematicky obsazovala klíčová místa v Dopravním podniku hl. m. Prahy, aby spřátelení manažeři mohli ovlivňovat výběrová řízení, a brala za to úplatky [39][40].
  - Soud ale dopravnímu podniku nepřiznal postavení poškozeného, protože škodu nespecifikoval ani nevyčíslil [34]. U soudu zazněly výpovědi o úplatku 50 milionů korun spojeném s projektem Nové Holešovice; Redl je označuje za nevěrohodné [37]. Dozimetr je tak příkladem velkého politického skandálu, u něhož není známo, kolik stál veřejné rozpočty.
- **Právní stav k 3. 10. 2026:** Hlavní líčení probíhá. Pavel Kos vinu uznal, Michal Redl a Petr Hlubuček ji odmítají [35][36]. Ve vedlejší větvi o zakázce VZP byl obžalován Marek Šnajdr, který vinu rovněž odmítá [38]. Rozsudek zatím nepadl, platí presumpce neviny.
- **Zdroje:**
  - [34] Seznam Zprávy: Dopravní podnik není v Dozimetru jako poškozený. Neprokázal škodu, uvedl soud. https://www.seznamzpravy.cz/clanek/domaci-kauzy-dopravni-podnik-neni-v-dozimetru-jako-poskozeny-neprokazal-skodu-uvedl-soud-276734
  - [35] E15: Soud v kauze Dozimetr přehledně: Redl odmítl vinu, Kos se přiznal. https://www.e15.cz/domaci/redl-odmitl-vinu-jeho-blizky-pritel-kos-se-priznal-shrnujeme-hlavni-body-soudu-v-kauze-dozimetr-1427547
  - [36] ČTK / České noviny: Kos uznal vinu v kauze Dozimetr, Redl i Hlubuček ji odmítli. https://www.ceskenoviny.cz/zpravy/2723645
  - [37] Reflex: Výpovědi o 50milionovém úplatku jsou nedůvěryhodné, říká Redl k projektu Nové Holešovice. https://www.reflex.cz/clanek/online-prenos/135915/vypovedi-o-50milionovem-uplatku-jsou-neduveryhodne-rika-redl-k-projektu-nove-holesovice-glosovali-jsme-zive.html
  - [38] Seznam Zprávy: Exposlanec ODS skončí kvůli Dozimetru před soudem. Podle žalobce uplácel. https://www.seznamzpravy.cz/clanek/domaci-kauzy-exposlanec-ods-skonci-kvuli-dozimetru-pred-soudem-podle-zalobce-uplacel-303444
  - [39] Wikipedie: Kauza Dozimetr. https://cs.wikipedia.org/wiki/Kauza_Dozimetr
  - [40] ČT24: téma Akce Dozimetr. https://ct24.ceskatelevize.cz/tema/akce-dozimetr-1703

### Frakce ID v Evropském parlamentu

- **id:** `frakce-id`
- **Období:** 2019–2024, vyšetřování od roku 2025
- **rank:** 4
- **Jedna věta:** Evropský veřejný žalobce vyšetřuje, jak bývalá frakce Identita a demokracie v Evropském parlamentu nakládala s penězi z rozpočtu EU.
- **Klíčoví aktéři:**
  - Bývalá frakce Identita a demokracie (2019–2024) – členy byly mimo jiné francouzské Národní sdružení, italská Liga a česká SPD
  - Nikdo z SPD není podle dostupných zdrojů obviněn
- **Částka:** ≈ 105 mil. Kč (4,3 mil. €)
- **Typ částky:** podezření, peníze EU
- **Vysvětlení částky:** Tolik podle návrhu auditu Evropského parlamentu mohla frakce použít neoprávněně. Jde o peníze z rozpočtu EU, ne z českého státního rozpočtu.
- **Podrobný popis:**
  - Úřad evropského veřejného žalobce (EPPO) v červenci 2025 zahájil vyšetřování možného zneužití 4,3 milionu eur, které frakce ID dostala v letech 2019–2024 [41][42]. Částka vychází z návrhu auditu Evropského parlamentu, který kritizoval nesprávné zadávání zakázek a dary na činnost nesouvisející s prací parlamentu [42].
  - 30. června 2026 proběhly razie ve Francii, Španělsku, Itálii a Belgii [41]. V Česku se nezasahovalo a nikdo z SPD obviněn není.
- **Právní stav k 3. 10. 2026:** Vyšetřování EPPO probíhá, obžaloba podána nebyla. Platí presumpce neviny.
- **Zdroje:**
  - [41] ČTK / České noviny (6/2026): Policie podniká razie kvůli údajnému zneužití peněz EU parlamentní frakcí ID. https://www.ceskenoviny.cz/zpravy/policie-podnika-razie-kvuli-udajnemu-zneuziti-penez-eu-parlamentni-frakci-id/2845806
  - [42] EURACTIV.cz: Frakce ID čelí podezření ze zneužití milionů eur. Působila v ní i česká SPD. https://euractiv.cz/section/aktualne-v-eu/news/frakce-id-celi-podezreni-ze-zneuziti-milionu-eur-pusobila-v-ni-i-ceska-spd/

### Motol

- **id:** `motol`
- **Období:** zakázky před rokem 2025, zadržení v říjnu 2025
- **rank:** 5
- **Jedna věta:** Podle policie brali šéfové největší české nemocnice úplatky od dodavatelů, mimo jiné při rekonstrukci jednoho z pavilonů.
- **Klíčoví aktéři:**
  - Miloslav Ludvík – bývalý ředitel Fakultní nemocnice v Motole
  - Pavel Budinský – bývalý náměstek ředitele
  - Geosan Group – stavební firma, obviněná v září 2026
- **Částka:** 85 mil. Kč
- **Typ částky:** tvrzení policie
- **Vysvětlení částky:** O tolik byl podle policie předražen dodatek ke stavební zakázce. Soud to zatím neposuzoval.
- **Podrobný popis:**
  - Detektivové Národní centrály proti organizovanému zločinu na žádost Úřadu evropského veřejného žalobce tvrdí, že exředitel Miloslav Ludvík a jeho náměstek Pavel Budinský přijímali úplatky od dodavatelů nemocnice [44][47].
  - Hlavní linie se týká rekonstrukce Modrého pavilonu za 1,2 miliardy korun bez DPH, kterou prováděla firma Geosan Group. Dodatek na vícepráce byl podle policie předražen o 85 milionů korun, z čehož mělo 10 milionů jít na úplatky [43][46]. Policie zajistila majetek za 230 milionů korun [43]. Ludvík vinu popírá [45].
- **Právní stav k 3. 10. 2026:** Obviněno je 19 lidí a několik firem, od září 2026 i Geosan [43]. Obžaloba zatím podána nebyla, platí presumpce neviny.
- **Zdroje:**
  - [43] Zdravotnický deník (9/2026): Kauza úplatků v Motole se rozrůstá. Policie obvinila stavební gigant Geosan. https://www.zdravotnickydenik.cz/2026/09/kauza-uplatku-v-motole-se-rozrusta-policie-obvinila-stavebni-gigant-geosan/
  - [44] iROZHLAS (10/2025): Kauza Motol: Ludvík zůstává ve vazbě. Soud má obavu, že by mohl utéct. https://www.irozhlas.cz/zpravy-domov/motol-miloslav-ludvik-vazba_2510171019_kno
  - [45] ČT24: Kauza Motol: Budinský je na svobodě. Ludvík tvrdí, že nebral úplatky. https://ct24.ceskatelevize.cz/clanek/domaci/zalobkyne-pustila-z-vazby-budinskeho-z-kauzy-motol-369769
  - [46] Odkryto.cz: „O žebrácký holi nepůjdeme“. Nové odposlechy v kauze Motol. https://odkryto.cz/o-zebracky-holi-nepujdeme-nove-odposlechy-v-kauze-motol
  - [47] Wikipedie: Kauza Motol. https://cs.wikipedia.org/wiki/Kauza_Motol

### Sportovní dotace

- **id:** `sportovni-dotace`
- **Období:** 2017, pravomocně 2025
- **rank:** 7
- **Jedna věta:** Náměstkyně ministerstva školství podle soudu rozdělovala dotace pro sportovní kluby podle přání šéfa fotbalové asociace.
- **Klíčoví aktéři:**
  - Simona Kratochvílová – bývalá náměstkyně pro sport na ministerstvu školství (pravomocně odsouzena)
  - Miroslav Pelta – bývalý předseda Fotbalové asociace ČR (pravomocně odsouzen)
  - Kateřina Valachová – tehdejší ministryně školství (ČSSD), kvůli kauze rezignovala; obžalovaná nebyla
- **Částka:** 0 Kč (pokus o škodu nejméně 175 mil. Kč)
- **Typ částky:** pokus, škoda nevznikla
- **Vysvětlení částky:** Ministerstvo po zatčení náměstkyně vyplácení zastavilo, takže peníze neodešly. Soud dvojici odsoudil za pokus.
- **Podrobný popis:**
  - Podle soudu Pelta a Kratochvílová v roce 2017 ovlivnili rozdělení peněz z programu pro materiálně-technickou podporu sportovních klubů v celkovém objemu 454 milionů korun a zvýhodnili 18 žadatelů [48][51]. Pokusili se tak způsobit státu škodu nejméně 175 milionů korun [49][51].
  - Ke škodě nedošlo, protože ministerstvo po zatčení Kratochvílové vyplácení pozastavilo, programy zrušilo a vyhlásilo znovu [51]. Ministerstvo školství se přesto v řízení domáhalo náhrady škody přes 1,1 miliardy korun [52]. Soudy se k věci vracely třikrát; předseda České unie sportu Miroslav Jansta byl obžaloby zproštěn [52].
- **Právní stav k 3. 10. 2026:** Vrchní soud v Praze 28. 5. 2025 pravomocně potvrdil tresty: Pelta 5,5 roku vězení a 5 milionů korun, Kratochvílová 6 let a 2 miliony korun [48][49]. Kratochvílová do vězení nastoupila [50].
- **Zdroje:**
  - [48] Seznam Zprávy (5/2025): Fotbalový boss Pelta půjde za sportovní dotace na 5,5 roku do vězení. https://www.seznamzpravy.cz/clanek/domaci-kauzy-vrchni-soud-pelta-pujde-za-sportovni-dotace-do-vezeni-277747
  - [49] ČTK / České noviny (5/2025): Soud potvrdil v kauze dotací Peltovi a Kratochvílové tresty vězení. https://www.ceskenoviny.cz/zpravy/2678982
  - [50] ČT24: Kratochvílová z kauzy sportovních dotací nastoupila do vězení. https://ct24.ceskatelevize.cz/clanek/domaci/kratochvilova-z-kauzy-sportovnich-dotaci-nastoupila-do-vezeni-365794
  - [51] Echo24 (2023): Peltu uznal soud vinným. Dostal 6 let vězení, Kratochvílová 6,5 roku. https://www.echo24.cz/a/Hkk95/zpravy-domov-soud-unal-miroslav-pelta-vinnym-verdikt-je-nepravomocny
  - [52] ČT24 (2024): Vrchní soud zrušil rozsudek v kauze sportovních dotací, Peltův případ se bude řešit potřetí. https://ct24.ceskatelevize.cz/clanek/domaci/vrchni-soud-zrusil-rozsudek-v-kauze-sportovnich-dotaci-peltuv-pripad-se-bude-resit-potreti-349984

### Stoka

- **id:** `stoka`
- **Období:** 2015–2019
- **rank:** 6
- **Jedna věta:** Podle soudu skupina kolem místostarosty brněnské městské části manipulovala za úplatky radniční zakázky.
- **Klíčoví aktéři:**
  - Jiří Švachula – bývalý místostarosta Brna-středu, tehdy člen ANO
  - Lubomír Smolka – podnikatel
- **Částka:** 49 mil. Kč
- **Typ částky:** nárok poškozeného
- **Vysvětlení částky:** Takovou škodu uplatnila u soudu radnice Brno-střed. Státní zástupce celkovou škodu odhadoval až na půl miliardy korun.
- **Podrobný popis:**
  - Podle soudu organizovaná skupina kolem místostarosty Jiřího Švachuly v letech 2015–2019 ovlivňovala zakázky městské části Brno-střed výměnou za úplatky [55]. Zmanipulované zakázky měly hodnotu přes 260 milionů korun a úplatky dosahovaly desítek milionů [55][56].
  - Radnice uplatnila škodu 49 milionů korun, státní zástupce celkovou škodu odhadl zhruba na půl miliardy [53][54]. Kauza se týká rozpočtu městské části, ne státu.
- **Právní stav k 3. 10. 2026:** Původní trest 9,5 roku pro Švachulu zrušil Vrchní soud v Olomouci [55][56]. V prosinci 2025 soud schválil dohody o vině a trestu: Švachula dostal 7 let a 8 měsíců, podnikatel Lubomír Smolka podmínku a peněžitý trest 3 miliony korun [53][54].
- **Zdroje:**
  - [53] iROZHLAS (12/2025): Kauza Stoka: Smolka dostal podmínku a peněžitý trest, Švachula má trest snížený. https://www.irozhlas.cz/zpravy-domov/kauza-stoka-soud-schvalil-prvni-dohodu-smolka-dostal-podminku-a-penezity-trest-3_2512041013_mkm
  - [54] Deník: Kauza Stoka: Švachula půjde znovu do vězení, Smolka vyvázl s podmínkou. https://www.denik.cz/krimi/soud-brno-kauza-stoka-svachula-sedm-let-vezeni.html
  - [55] Aktuálně.cz: Švachula půjde do vězení na 9,5 roku. Kauza Stoka pokračuje dalším prověřováním. https://zpravy.aktualne.cz/domaci/stoka-schema-aktualizace/r~a88a4ec6e0b111eca9eeac1f6b220ee8/
  - [56] ČTK / České noviny: Soud v Brně uložil expolitikovi Švachulovi v kauze Stoka 9,5 roku vězení. https://www.ceskenoviny.cz/zpravy/soud-v-brne-ulozil-v-expolitikovi-svachulovi-v-kauze-stoka-9-5-roku-vezeni/2213397

---

## Záložní kauza (v kvízu není)

### eDálnice: e-shop na dálniční známky

- **id:** `edalnice`
- **Období:** 2020
- **Navržený rank při zařazení:** 7 (přidá se ke kauzám s nulovou škodou)
- **Jedna věta:** Státní fond zadal bez soutěže stavbu e-shopu na elektronické dálniční známky za cenu, kterou odborníci označili za mnohonásobně přemrštěnou.
- **Klíčoví aktéři:**
  - Vladimír Kremlík – tehdejší ministr dopravy (za ANO), po kritice skončil ve funkci
  - Karel Havlíček – jeho nástupce (za ANO), zakázku zrušil
- **Částka:** ≈ 0 Kč (zakázka za 401 mil. Kč zrušena bez sankce)
- **Typ částky:** zakázka zrušena
- **Podrobný popis:** Státní fond dopravní infrastruktury zadal v roce 2020 bez veřejné soutěže firmě Asseco Central Europe vytvoření a čtyřletý provoz systému za 401 milionů korun bez DPH. Odborníci odhadovali, že podobný projekt by mohl stát kolem 40 milionů. Po kritice ministr Kremlík skončil, nástupce Havlíček zakázku zrušil bez sankce a kvůli příbuzenskému propojení mezi pracovníky fondu a firmou, která zakázku připravovala, podal trestní oznámení. Systém nakonec převzal státní podnik CENDIS.
- **Zdroje (při zařazení očíslovat):**
  - ČT24: Zakázka na IT systém elektronických dálničních známek bude zrušena bez sankce, říká Havlíček. https://ct24.ceskatelevize.cz/clanek/ekonomika/zakazka-na-it-system-elektronickych-dalnicnich-znamek-bude-zrusena-bez-sankce-rika-havlicek-55307
  - iROZHLAS: Zakázka na elektronické známky bude podle Havlíčka stát polovinu. Kvůli původní podal trestní oznámení. https://www.irozhlas.cz/zpravy-domov/karel-havlicek-dalnicni-znamky-polovina-zakazka-zruseni_2002111807_tzr
  - Aktuálně.cz: Bez tendru a v utajení. Stát čelí kritice za e-shop na dálniční známky za 401 milionů. https://zpravy.aktualne.cz/ekonomika/doprava/e-shop-na-dalnicni-znamky-za-401-milionu-stat-ho-vybral-bez/r~17b965cc379311ea82ef0cc47ab5f122/
  - Echo24: Dálniční známky i kontrolu mýta zajistí státní podnik. Stát tak ušetří přes 500 milionů korun. https://www.echo24.cz/a/SFNBF/dalnicni-znamky-i-kontrolu-myta-zajisti-statni-podnik-stat-tak-usetri-pres-500-milionu-korun

---

## Výhrady a úkoly před zveřejněním

- **Presumpce neviny:** Pravomocně odsouzení jsou jen Nagyová (Čapí hnízdo), Pelta a Kratochvílová (Sportovní dotace) a aktéři Stoky. Bitcoinová kauza, Dozimetr a Motol jsou ve fázi obžaloby nebo obvinění, u Frakce ID probíhá vyšetřování. Andrej Babiš odsouzen nebyl. V aplikaci se proto u lidí používá označení „Klíčoví aktéři“, nikoli „viníci“.
- **Různé rozpočty:** Stoka se týká rozpočtu městské části, Frakce ID rozpočtu EU, Čapí hnízdo kombinace rozpočtu EU, státu a kraje.
- **Proměnlivost:** Stav u Agrofertu (Evropská komise), Bitcoinové kauzy (soud), Dozimetru (rozsudek), Motolu (obžaloba) a Čapího hnízda (dovolání) se může rychle změnit. Před zveřejněním ho ověřte a aktualizujte datum „Stav k“.
- **Wikipedie** slouží jen jako doplňkový přehledový zdroj, žádné číslo nestojí jen na ní.
- **TODO:** primární odkaz na kontrolní závěr NKÚ ke covidovým nákupům; zdroj k pokutě ÚOHS u digitalizace.
