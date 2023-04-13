# Final Project
## Turn-Based Dungeon Crawler

### Landing Page
- Instructions
- Enemy Info Page? (only if there's time)
- View Past Stats? (only if there's time)
- Start New Game -> Character Creation
- Background music (from internet)

### Character Creation Screen
- Player Name
- Choose Job (class is a protected term)
    - Ranger
    - Warrior
    - Ninja
    - Mage
- Background Music (from internet)
### Dungeon Screen
- Map of Dungeon
    - Multiple maps eventually?
    - Possibly a maze (good generator at: https://keesiemeijer.github.io/maze-generator/)
    - Multi-Dimensional Array
    - Is Path - Can walk
    - Is Wall - Can't walk
- Character Sprite
- D-Pad
    - OnPress - move one tile
    - OnLongPress - move one tile per 1/2 second?
- Random boolean generator each tile
    - True - Fight Happens
- Treasure Chest at the end of the "maze" -> Victory
- Background Music (from internet)

### Fight Screen
- Dungeon Background
- Character Sprite on Left
    - Health Bar underneath
- Enemy Sprite(s) on Right
    - Health Bar underneath
- Attack/Cast/Defend Buttons along bottom row
    - Attack - Basic Attack (damage based on class)
    - Cast - Magic Attack (may not be available?)
    - Defend - Cut next Damage (amount based on class)
- Shake to power up? (Gyroscope)
- Enemy will randomly either Attack/Cast/Defend (based on enemy type)
- Take turns until either player health or enemy health reaches 0
    - Player Health reaches 0 -> Game Over
    - Enemy Health reaches 0 -> Drops a potion to recover player health, back to Map Screen
- Background music and sound effects (from internet)

### Victory Screen
- Congratulate the Player
- Show Stats
    - Player Name
    - Player Class
    - Number of Fights Won
    - Time to complete dungeon?
    - Save stats to DB
- Victory fanfare (from internet)

### Game Over Screen
- Show Stats
    - Player Name
    - Player Class
    - Number of Fights Won
    - Enemy type that caused death
    - Time until death?
    - Save stats to DB
- Sad music (from internet)