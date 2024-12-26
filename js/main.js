const move = (array,directions)=>{
    _row = array.length;
    _col = array[0].length;

    const print = ()=>{
        console.log(array.join("\n")+"\n");
    }

    // 判断一个下标是否越界
    const inRange = (i,j)=>{
        return i>=0 && i<_row && j>=0 && j<_col;
    }

    // 不同方向的移动结果
    const op = {
        "down": (i,j)=>[i-1,j],
        "left": (i,j)=>[i,j+1],
        "up": (i,j)=>[i+1,j],
        "right": (i,j)=>[i,j-1]
    }

    // 寻找下一个位置
    const next = (i,j)=>{
        return op[directions](i,j);
    }

    // 寻找下一个非零的位置
    const nextNoZero = (i,j)=>{
        let [ni,nj] = next(i,j);
        if(!inRange(ni,nj)) return null;
        while(inRange(ni,nj)){
            if(array[ni][nj]!=0){
                return [ni,nj,array[ni][nj]];
            }
            [ni,nj] = next(ni,nj);
        }
        return null;
    }
    // 计算处理一行或一列
    const calc = (i,j)=>{
        if(!inRange(i,j)) {return;}
        let nxt = nextNoZero(i,j);
        if(!nxt){
            return;
        }
        let [nextI,nextJ,nextValue] = nxt;
        // 当前位置为0
        if(array[i][j]==0){
            // 寻找下一个不为0的
            array[i][j] = nextValue;
            array[nextI][nextJ] = 0;
            calc(i,j);
        }else if(array[i][j] == nextValue){
            array[i][j] *=2;
            array[nextI][nextJ] = 0;
        }
        const [ni,nj] = next(i,j);
        calc(ni,nj);
    }

    if(directions=="up"){
        // 循环第一行去计算
        for(let j=0;j<_col;j++){
            calc(0,j);
        }
    }else if(directions=="right"){
        // 循环最后一列去计算
        for(let i=0;i<_row;i++){
            calc(i,_col-1);
        }
    }else if(directions=="down"){
        // 循环最后一行去计算
        for(let j=0;j<_col;j++){
            calc(_row-1,j);
        }
    }else if(directions=="left"){
        // 循环第一列去计算
        for(let i=0;i<_row;i++){
            calc(i,0);
        }
    }
    print();
}

let cavans = document.getElementById("canvas");
let context = cavans.getContext('2d');
// 帧结构
frame = {
    // 一次性帧,播放完立即消失
    once:[],
    // 永久帧,循环播放
    forver:new Map()
}

const Color = {
    grid: "RGBA(205,193,180,1)",
    backGround: "RGBA(187,173,160,1)",
    block2:"RGBA(134,235,85,1)"
}

row = 4;
col = 4;
cavansHeight = 1000
cavansWidth = 1000

const array = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
]

// move(array,"up");
// move(array,"left");
// move(array,"down");
// move(array,"right");

// 方块动画有三:出现,移动,移动并合成

class Block{
    // 构造一个新的方块
    constructor(x,y,value,status){
        this.x = x;
        this.y = y;
        this.value = value;
        if(status=="appear"){
            blockAppear(x,y)
        }
    }
}
// 画矩形
const drawRoundedRectangle = (x, y, width, height, r, color)=>{
    ctx = context;
    ctx.beginPath();
    ctx.fillStyle = color;//矩形填充颜色
    // 起点比原点向右移动了一个r
    ctx.moveTo(x + r, y);
    // 向终点-r发起连线
    ctx.lineTo(x + width - r, y);
    // 右上角圆角
    ctx.arc(x + width - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
    ctx.lineTo(x + width, y + height - r);
    ctx.arc(x + width - r, y + height - r, r, 0, Math.PI * 0.5);
    ctx.lineTo(x + r, y + height);
    ctx.arc(x + r, y + height - r, r, Math.PI * 0.5, Math.PI);
    ctx.lineTo(x, y + r);
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
    ctx.fill();
}

// 绘制棋盘
const drawBoardAnimation = async (i=30)=>{
    // 绘制棋盘
    const drawBoard = (row,col)=>{
        // 画布获取宽高
        height = cavansHeight;
        width = cavansWidth;
        // 方块的宽高
        bh = height/row;
        bw = width/col;
        // 边框的宽高
        oh = bh*0.08;
        ow = bw*0.08;

        // 设置颜色
        //context.strokeStyle  = 'RGB(187,173,160)';
        for(let i=0;i<row;i++){
            for(let j=0;j<col;j++){
                drawRoundedRectangle(
                    i*bh+oh,
                    j*bw+ow,
                    bh-2*oh,
                    bw-2*ow,10,
                    Color.grid
                );
            }
        }
    }
    frame.once.push({
        fn:drawRoundedRectangle,
        args:[0,0,1000,1000,0,Color.backGround],
        index:0
    });
    // 单帧
    frame.once.push({
        fn:drawBoard,
        args:[i/10,i/10],
        index:1
    });
    if(i<row*10){
        requestAnimationFrame(async ()=>{
            // 下一帧的时候
            await drawBoardAnimation(i+1);
        });
    }else{
        frame.forver.set("背景",{
            fn:drawRoundedRectangle,
            args:[0,0,1000,1000,0,Color.backGround],
            index:0
        })
        // 到达指定位置,生成永久帧
        frame.forver.set("棋盘",{
            fn:drawBoard,
            args:[row,col],
            index:1
        })
    }
}

const randomBlock = (defaultValue)=>{
    ran = []
    for(let i in array){
        for(let j in array[0]){
            if(array[i][j] == 0) ran.push([i,j])
        }
    }
    if(ran.length==0){
        return false;
    }else{
        let [i,j] = ran[Math.round(Math.random()*(ran.length-1))];
        let value;
        if(defaultValue){
            value = defaultValue;
        }else{
            value = [2,2,2,4][Math.round(Math.random()*3)];
        }
        array[i][j] = new Block(i,j,value,"appear");
        return true;
    }
}

// i,j处的方块出现
const blockAppear = (i,j)=>{
    // 起点=方块左上角下标+方块宽度/2
    // 起点向左上角移动,一次一单位
    // 长宽增加,一次两单位
    // 画布宽高
    height = cavansHeight;
    width = cavansWidth;
    // 方块的宽高
    bh = height/row;
    bw = width/col;
    // 边框的宽高
    oh = bh*0.08;
    ow = bw*0.08;

    // i*bh+oh,
    // j*bw+ow,
    // bh-2*oh,
    // bw-2*ow,10,
    // Color.block2
    step = 9.88;
    const draw = (drawI,drawJ,drawH,drawW)=>{
        console.log(drawI,drawJ,drawH,drawW);
        console.log(i*bh+oh,j*bw+ow,bh-2*oh,bw-2*ow);
        if(drawI>i*bh+oh){
            frame.once.push({
                fn:drawRoundedRectangle,
                args:[
                    drawI,
                    drawJ,
                    drawH,
                    drawW,10,
                    Color.block2
                ],
                index:3
            });
            requestAnimationFrame(()=>{draw(drawI-step,drawJ-step,drawH+step*2,drawW+step*2)});
        }else{
            frame.forver.set("方块"+i+"_"+j,{
                fn:drawRoundedRectangle,
                args:[
                    i*bh+oh,
                    j*bw+ow,
                    bh-2*oh,
                    bw-2*ow,10,
                    Color.block2
                ],
                index:3
            });
        }
    }

    // 开始绘制的位置和宽高
    draw(
        i*bh+oh+(bh-2*oh)/2,
        j*bw+ow+(bw-2*ow)/2,
        0,0
    );


}

// 游戏入口
const startGame = async ()=>{

    const resetFrame = ()=>{
        frame.once.length = 0;
        frame.forver = new Map();

    }
    // 重置所有帧
    resetFrame();
    drawBoardAnimation(39);
    // 绘制棋盘
    blockAppear(0,0);
    // randomBlock();
    // randomBlock();
    

}

// 帧分为两种:永远绘制的和绘制一次便销毁的
const draw = ()=>{
    values = new Array(...frame.forver.values());
    // 按照图层排序
    values.sort((a,b)=>{return a.index-b.index})
    // 绘制一次帧
    if(frame.once.length!=0){
        once = frame.once.sort((a,b)=>{return a.index-b.index});
        console.log(once);
        // alert();
        for(let {fn,args} of once){
            fn(...args);
        }
        frame.once.length = 0;
    }
    // 绘制永久帧
    for(let {fn,args} of values){
        fn(...args);
    }
    // 循环调用
    requestAnimationFrame(draw);
}
draw();
//export default Game;