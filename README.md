# Projectplan: Urenregistratie Website

## Introductie
In dit project wordt een urenregistratiesysteem ontwikkeld met behulp van HTML, CSS en JavaScript. Dit systeem is bedoeld om gebruikers een eenvoudige en efficiënte manier te bieden om gewerkte uren te registreren. Het project richt zich op een intuïtieve interface, waarbij gebruikers gemakkelijk gegevens kunnen invoeren en beheren. Daarnaast biedt het systeem een kalenderweergave, waarmee gebruikers snel kunnen navigeren tussen verschillende weken.

## Projectdoel
Het doel van dit project is om een gebruiksvriendelijk en efficiënt urenregistratiesysteem te ontwikkelen, waarin de volgende aspecten centraal staan:

- **Eenvoudige invoer van uren**: Gebruikers moeten op een intuïtieve manier uren kunnen registreren via een tabelindeling.
- **Kalenderweergave**: De weekindeling (maandag t/m zondag) blijft consistent, waarbij de huidige dag gemarkeerd wordt.
- **Flexibele klant- en projectbeheer**: Gebruikers kunnen direct een nieuwe klant toevoegen via een plusicoon naast de kalender.
- **Overzichtelijke navigatie**: Er wordt een eenvoudige manier geboden om te navigeren tussen weken, waarbij de maandag van de geselecteerde week wordt weergegeven.
- **Moderne technologieën**: Het project maakt gebruik van HTML, CSS en JavaScript om een snelle en responsieve applicatie te garanderen.

## De gebruikte technieken

### 1. HTML
HTML wordt gebruikt voor de structuur van de applicatie. Het zorgt ervoor dat alle elementen correct worden weergegeven in de browser. Voordelen van HTML in dit project:

- **Duidelijke structuur** voor de gebruikersinterface.
- **Gemakkelijk uitbreidbaar** met extra elementen indien nodig.
- **Ondersteund door alle moderne browsers** zonder extra afhankelijkheden.

### 2. CSS
CSS wordt gebruikt om de applicatie vorm te geven en een aantrekkelijke, gebruiksvriendelijke interface te creëren. De voordelen van CSS in dit project zijn:

- **Responsief ontwerp** zodat de applicatie goed werkt op verschillende schermformaten.
- **Consistente styling** over de gehele applicatie.
- **Mogelijkheid om animaties en transities toe te voegen** voor een betere gebruikerservaring.

### 3. JavaScript
JavaScript wordt gebruikt om de applicatie interactief te maken en dynamische functionaliteiten toe te voegen. Voordelen van JavaScript in dit project:

- **Realtime updates** zonder dat de pagina vernieuwd hoeft te worden.
- **Gebruiksvriendelijke interacties** zoals het toevoegen van klanten via een plusicoon.
- **Flexibiliteit** om later extra functionaliteiten toe te voegen zoals datavalidatie en opslag in de browser.

Met deze combinatie van technologieën wordt een snelle, moderne en gebruiksvriendelijke urenregistratie-applicatie gecreëerd die voldoet aan de behoeften van de gebruikers.


## 2. Backlog met User Stories

### Must-Have
1. **Als gebruiker wil ik mijn uren kunnen registreren per dag** zodat ik mijn werkuren kan bijhouden.
   - **Acceptatiecriteria:**
     - Een kalenderweergave waar gebruikers hun uren per dag kunnen invoeren.
     - Mogelijkheid om uren toe te voegen, aan te passen en te verwijderen.

2. **Als gebruiker wil ik kunnen inloggen met mijn Clockwise account** zodat ik toegang heb tot mijn urenregistratie.
   - **Acceptatiecriteria:**
     - Een inlogpagina die gebruikers authenticatie biedt via de Clockwise API.
     - Beveiligde toegang tot de urenregistratiepagina's.

3. **Als gebruiker wil ik een overzicht zien van mijn totaal aantal uren per week** zodat ik mijn voortgang kan monitoren.
   - **Acceptatiecriteria:**
     - Een samenvatting onderaan de urenregistratiepagina die het totaal aantal uren per week weergeeft.

4. **Als gebruiker wil ik kunnen wisselen tussen verschillende weken** zodat ik mijn uren van eerdere weken kan bekijken en bewerken.
   - **Acceptatiecriteria:**
     - Navigatie-opties om tussen weken te schakelen (bijv. week 1, week 2).
     - Mogelijkheid om uren van verschillende weken apart te bekijken en bij te werken.

5. **Als gebruiker wil ik een knop hebben om naar vandaag te navigeren** zodat ik snel kan zien welke dag het vandaag is.
   - **Acceptatiecriteria:**
     - Een "Vandaag" knop die de gebruiker direct naar de huidige dag in de kalender navigeert en deze markeert.

### Should-Have
6. **Als gebruiker wil ik een donkere modus kunnen inschakelen** zodat ik prettiger kan werken in donkere omgevingen
   - **Acceptatiecriteria:**
     - Een knop waarmee de gebruiker kan schakelen tussen lichte en donkere modus.
     - De keuze wordt onthouden voor toekomstige sessies.

### Could-Have
7. **Als gebruiker wil ik mijn uren zowel handmatig kunnen invoeren als met pijltjestoetsen kunnen aanpassen** zodat ik sneller en gemakkelijker mijn uren kan registreren.
   - **Acceptatiecriteria:**
     - Gebruikers kunnen uren direct typen in het invoerveld.
     - Met de pijltjestoetsen ↑ en ↓ kunnen uren in kleine stappen verhoogd of verlaagd worden.

## 3. Planning

|  Dag   | Taak |
|--------|------|
| 1 en 2 | Opzetten van HTML/CSS-structuur en basis JavaScript-functionaliteit |
| 3 en 4 | Implementeren van kalenderweergave en urenregistratie functionaliteit |
| 5 en 6 | Toevoegen van navigatie tussen weken en "Vandaag" knop |
| 7 en 8 | Implementeren van totaal aantal uren per week en samenvatting |
| 9 en 10| Integratie met Clockwise API voor inloggen en authenticatie |
|11 en 12| Darkmode optie toevoegen (should-have) |
|   13   | Testen, optimaliseren en documenteren van de website |

## 4. Bewijs van Voortgangsbewaking
Tijdens het project zal de voortgang worden bijgehouden via:
- **Scrum-board**: Taken worden geprioriteerd en beheerd.
- **Versiebeheer (Git/GitHub)**: Regelmatige commits en updates van de code.
- **Testlogboek**: Documentatie van eventuele bugs en fixes tijdens testfases.

## 5. Definition of Done
Een user story is pas afgerond als:
- De functionaliteit volledig werkt zonder bugs.
- De code geoptimaliseerd en goed gestructureerd is.
- De gebruikersinterface gebruiksvriendelijk en visueel aantrekkelijk is.
- De functionaliteit is getest en gevalideerd door minstens één gebruiker.
