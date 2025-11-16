// priority:6
//魔法复现

//梅露露的魔法
let meruruMahoCost = 10000
ItemEvents.entityInteracted("mocai:meruru_cross",event =>{
    if (!isMajoProgressing){return 0}
    let player = event.player
    if (!isMajoPlayer(player)){return 0}
    let majo = isMajoPlayer(player)
    if (majo.name != "冰上梅露露"){return 0}
    let entity = event.target
    let server = event.server
    let pressureScore = server.scoreboard.getOrCreatePlayerScore(majo.scoreHolder,pressure)
    entity.potionEffects.add("minecraft:regeneration",200,0,false,true)
    pressureScore.add(meruruMahoCost)
    server.runCommandSilent("/execute as "+player.name.string+" at @s run playsound minecraft:block.beacon.ambient voice @a ~ ~ ~ 0.5 2")
    player.addItemCooldown("mocai:meruru_cross",1200)
})

//奈叶香的枪
let reloadTimePause = 72000
PlayerEvents.tick(event =>{
    if (!isMajoProgressing){return 0}
    let player = event.player
    let time = event.server.tickCount
    for (let i = 0;i<player.inventory.slots;i++){
        let item = player.inventory.getStackInSlot(i)
        if (item.is("tacz:modern_kinetic_gun")){
            if (item.customData.contains("maho")){
                let ammoCount = item.customData.getInt("GunCurrentAmmoCount")
                let barrelAmmo = item.customData.getInt("HasBulletInBarrel")
                if ((ammoCount > 4 && barrelAmmo == 1) || (ammoCount > 5 && barrelAmmo == 0)){return 0}
                if (time % reloadTimePause != 0){return 0}
                let newItem = 'tacz:modern_kinetic_gun[custom_data={GunCurrentAmmoCount:'+(ammoCount+1)+',GunFireMode:'+item.customData.getString("GunFireMode")+',GunId:'+item.customData.get("GunId")+',HasBulletInBarrel:'+item.customData.get("HasBulletInBarrel")+',maho:1b}]'
                player.inventory.setStackInSlot(i,newItem)
            }
        }
    }    
})

//玛格的发言实现见player_behaviour部分
//玛格的模仿录入
ItemEvents.entityInteracted("mocai:margo_tarot",event =>{
    if (!isMajoProgressing){return 0}
    let player = event.player
    if (!isMajoPlayer(player)){return 0}
    let majo = isMajoPlayer(player)
    if (majo.name != "宝生玛格"){return 0}
    let target = event.target
    if (!target.isPlayer()){return 0}
    if (!isMajoPlayer(target)){return 0}
    let targetMajo = isMajoPlayer(target)
    let server = event.server
    for (let learned of majo.learnedSound){
        if (targetMajo.name == learned.name){
            player.tell("§e这个声音已经学过了……")
            server.runCommandSilent("/execute as "+player.name.string+" at @s run playsound minecraft:block.note_block.harp voice @s")
            return 0
        }
    }
    majo.learnedSound.push(targetMajo)
    player.tell("§2学会了模仿祂的声音……")
    server.runCommandSilent("/execute as "+player.name.string+" at @s run playsound minecraft:block.note_block.harp voice @s")
})

//手持提示
PlayerEvents.tick(event =>{
    if (!isMajoProgressing){return 0}
    let player = event.player
    if (!isMajoPlayer(player)){return 0}
    let majo = isMajoPlayer(player)
    if (majo.name != "宝生玛格"){return 0}
    if (majo.selectedSound >= majo.learnedSound.length){majo.selectedSound = 0}
    let item = player.getMainHandItem()
    if (item.is("mocai:margo_tarot")){
        let imitated = majo.learnedSound[majo.selectedSound]
        let server = event.server
        server.runCommandSilent('/title '+player.name.string+' actionbar {"text":"正在使用声音:'+imitated.color+"◆"+imitated.name+'"}')
    }
})

//选择
ItemEvents.rightClicked("mocai:margo_tarot",event=>{
    if (!isMajoProgressing){return 0}
    let player = event.player
    if (!isMajoPlayer(player)){return 0}
    let majo = isMajoPlayer(player)
    if (majo.name != "宝生玛格"){return 0}
    majo.selectedSound += 1
})