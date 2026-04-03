const express = require("express");
//const { log } = require('node:console');
const si = require('systeminformation');
const app = express();
const port =  5050;
const stringOne = '未偵測到';
app.set('view engine','ejs');
app.set('views','./views');
async function computerInformation(req,res){
    try{
        const cpu = await si.cpu(); //cpu型號
        const gpu = await si.graphics(); //gpu
        const mem = await si.mem(); //記憶體
        const disk = await si.diskLayout(); //SSD
        const gpuList = gpu.controllers.map(g => {
            return `${g.vendor} ${g.model} - VRAM: ${(g.vram / 1024).toFixed(2)} GB`;
        });
        const GPU = gpuList.filter((item, index) => gpuList.indexOf(item) === index);
        const SSD = disk.map(d => `${d.vendor} ${d.name} ${Math.round(d.size / (1024 ** 3))} GB`)
        const baseboard = await si.baseboard(); //主機板
       // console.log(baseboard);
       // console.log(GPU);
        
       // const system = await si.system();
       // console.log(system);
        
        const hardwareInfo = {
            CPU: `${cpu.manufacturer} ${cpu.brand}`,
            RAM: `${(mem.total / (1024 ** 3)).toFixed(2)} GB`,
            GPU1: GPU[0] || stringOne,
            GPU2: GPU[1] || stringOne,
            SSD1: SSD[0] || stringOne,
            SSD2: SSD[1] || stringOne,
            SSD3:SSD[2] || stringOne,
            SSD4:SSD[3] || stringOne,
            MB: `${baseboard.manufacturer} ${baseboard.model}`,   // 主機板
        };

        res.render('hardware', { hardwareInfo });


    }
    catch(err){
        res.status(500);
    }
}
app.get('/hardware',computerInformation);


app.listen(port, () => {
  console.log(`伺服器已啟動：http://localhost:${port}`);
});


