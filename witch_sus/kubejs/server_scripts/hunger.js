// priority:7
//饱食度系统

let basicHungerSpeed = -40 //每刻减少的饱食度值
let foodDiscount = 0.5

//主进程

PlayerEvents.tick(event =>{
    let player = event.player
    if (!isMajoPlayer(player)){return 0}
    if (!isMajoProgressing){
        player.setFoodLevel(20)
        return 0
    }
    let majo = isMajoPlayer(player)
    let server = event.server
    let hungerScore = server.scoreboard.getOrCreatePlayerScore(majo.scoreHolder,hunger)
    if (!hungerScore.get() || hungerScore.get() > majo.maxFood){
        hungerScore.set(majo.maxFood)
    }
    player.setFoodLevel(Math.round(20*hungerScore.get()/majo.maxFood))
    player.setSaturation(0)
    if(Math.round(20*hungerScore.get()/majo.maxFood) > 0 && !isFocusMode){hungerScore.add(basicHungerSpeed*majo.extraFoodNeed*majo.extraFoodNeedFromSporting)}
})

//食品

ItemEvents.foodEaten(event =>{
    if (!isMajoProgressing){return 0}
    let player = event.player
    if (!isMajoPlayer(player)){return 0}
    let majo = isMajoPlayer(player)
    let food = event.item
    let server = event.server
    let hungerScore = server.scoreboard.getOrCreatePlayerScore(majo.scoreHolder,hunger)
    let hungerRecovery = food.getFoodProperties(player).nutrition()*48000+food.getFoodProperties(player).saturation()*48000
    hungerRecovery = Math.round(foodDiscount*hungerRecovery)
    hungerScore.add(hungerRecovery)
})