function sleep(time){
    var startTime = new Date().getTime();
    while(new Date().getTime() <= time+startTime)
    {
        
    }
}
win = false;
map = {
    2: "2",
    4: "4",
    8: "8",
    16: "16",
    32: "32",
    64: "64",
    128: "128",
    256: "256",
    512: "512",
    1024: "1024",
    2048: "2048",
}
// 0,0位置为9,9
// 1,1位置为126.5,126.5
// 相差117.5px
class Block{
    //构造器
    constructor(x,y,value,status){
        this.x = x;
        this.y = y;
        this.value = value;
        //等于2048就游戏胜利
        if(this.value>=2048){
            win = true;
        }
        this.e = document.createElement("div");
        if(status==0){
            this.e.classList = "block block-new block-"+value;
        }else{
            this.e.classList = "block block-appear block-"+value;
        }
        this.drawBlock();
        this.insert();
    }
    //渲染方块位置的函数,根据下标改变方块的定位
    drawBlock(){
        this.e.style.top = this.x*100+(2*this.x+1)*8.75+"px";
        this.e.style.left = this.y*100+(2*this.y+1)*8.75+"px";
        // this.e.innerHTML = this.value;
        this.e.innerHTML = map[this.value];
        this.e.id = "block"+"-"+this.x+"-"+this.y;
    }
    insert(){
        document.getElementById("games").append(this.e);
    }
}

//在棋盘上新建一个块
function newCell(block,value0){
    let empetyCell = []
    //找到棋盘上为空的地方
    for(let i=0;i<4;i++){
        for(let j=0;j<4;j++){
            if(block[i][j]==null){
                empetyCell.push([i,j]);
            }
        }
    }
    if(empetyCell.length==0){
        console.log("游戏结束");
        return;
    }
    //在这些为空的点中选一个
    let cell = empetyCell[
        Math.round(Math.random()*(empetyCell.length-1))
    ]
    //根据这个点的x，y坐标生成一个方块
    let value;
    if(value0==null){
        value = [2,2,2,4][Math.round(Math.random()*3)];
    }else{
        value = value0;
    }
    block[cell[0]][cell[1]] = new Block(cell[0],cell[1],value);
}

function move(direction,block,deleteBlock){
    //上，右，下，左
    //拿向上移动举例，先从最上方开始遍历，不是0的两两比较，相同则合并并将下面的清零
    //然后向下继续找，是0的跳过
    //直到找到为0的则记录这个0的位置，然后向下寻找第一个不是0的将其移动到0位置，
    // console.log(deleteBlock);
    // for(let e of deleteBlock){
    //     e.e.remove();
    //     console.log(e);
    // }
    // deleteBlock.length = 0;
    if(win==true){
        alert("恭喜您通关了");
        document.getElementById("endGame").style.display = "block";
        document.getElementById("endScore").innerHTML= totalScore;
        return;
    }
    var flag = false;//记录是否发生移动
    var score = 0;//记录本次移动产生的分数
    switch(direction){
        case 0:
            //向上移动
            //外层遍历列 
            for(let i=0;i<4;i++){
                //内层遍历行
                for(let j=0;j<4;j++){
                    // block[j][i]第j行第i列
                    if(block[j][i]==null){
                        //从上向下遍历行
                        for(var k=j;k<4;k++){
                            if(block[k][i]!=null){
                                block[j][i] = block[k][i];
                                block[j][i].x = j;
                                block[j][i].drawBlock();
                                block[k][i] = null;
                                flag = true;
                                break;
                            }
                        }
                        if(k==4 && block[3][i]==null){
                            j=4;
                            continue;
                        }
                    }
                    //不是第0个元素 相邻的两个值相等 不是空
                    if(j!=0 && block[j][i].value == block[j-1][i].value && block[j][i] != null){
                        //已存在的两个方块移动到目标位置
                        block[j][i].x = j-1;
                        block[j][i].drawBlock();
                        //生成新方块，同时将旧方块标记为待删除状态
                        deleteBlock.push(block[j][i]);
                        deleteBlock.push(block[j-1][i]);
                        block[j-1][i] = new Block(j-1,i,block[j-1][i].value*2,0);
                        block[j][i] = null;
                        j--;
                        flag = true;
                        score+=block[j][i].value;
                    }
                }
            }
        break;
        case 1: 
            //向右
            //外层遍历行
            for(let i=0;i<4;i++){
                //内层遍历列
                for(let j=3;j>=0;j--){
                    // block[i][j]第i行第j列
                    if(block[i][j]==null){
                        //从右向左遍历列
                        for(var k=j;k>=0;k--){
                            if(block[i][k]!=null){
                                block[i][j] = block[i][k];
                                block[i][j].y = j;
                                block[i][j].drawBlock();
                                block[i][k] = null;
                                flag = true;
                                break;
                            }
                        }
                        //k遍历到头找不到不为空的
                        if(k==-1 && block[i][0]==null){
                            j=-1;
                            continue;
                        }
                    }
                    //不是第0个元素 相邻的两个值相等 不是空
                    if(j!=3 && block[i][j].value == block[i][j+1].value && block[i][j] != null){
                        //已存在的两个方块移动到目标位置
                        block[i][j].y= j+1;
                        block[i][j].drawBlock();
                        //生成新方块，同时将旧方块标记为待删除状态
                        deleteBlock.push(block[i][j]);
                        deleteBlock.push(block[i][j+1]);
                        block[i][j+1] = new Block(i,j+1,block[i][j+1].value*2,0);
                        block[i][j] = null;
                        j++;
                        flag = true;
                        score+=block[i][j].value;
                    }
                }
            }
        break;
        case 2: 
            //向下移动
            //外层遍历列 
            for(let i=0;i<4;i++){
                //内层遍历行
                for(let j=3;j>=0;j--){
                    // block[j][i]第j行第i列
                    if(block[j][i]==null){
                        //从下向上遍历行
                        for(var k=j;k>=0;k--){
                            if(block[k][i]!=null){
                                block[j][i] = block[k][i];
                                block[j][i].x = j;
                                block[j][i].drawBlock();
                                block[k][i] = null;
                                flag = true;
                                break;
                            }
                        }
                        if(k==-1 && block[0][i]==null){
                            j=-1;
                            continue;
                        }
                    }
                    //不是第0个元素 相邻的两个值相等 不是空
                    if(j!=3 && block[j][i].value == block[j+1][i].value && block[j][i] != null){
                        //已存在的两个方块移动到目标位置
                        block[j][i].x = j+1;
                        block[j][i].drawBlock();
                        //生成新方块，同时将旧方块标记为待删除状态
                        console.log(j,i)
                        deleteBlock.push(block[j][i]);
                        deleteBlock.push(block[j+1][i]);
                        block[j+1][i] = new Block(j+1,i,block[j+1][i].value*2,0);
                        block[j][i] = null;
                        j++;
                        flag = true;
                        score+=block[j][i].value;
                    }
                }
            }
        break;
        case 3: 
            //向左
            //外层遍历行
            for(let i=0;i<4;i++){
                //内层遍历列
                for(let j=0;j<4;j++){
                    // block[i][j]第i行第j列
                    if(block[i][j]==null){
                        //从右向左遍历列
                        for(var k=j;k<4;k++){
                            if(block[i][k]!=null){
                                block[i][j] = block[i][k];
                                block[i][j].y = j;
                                block[i][j].drawBlock();
                                block[i][k] = null;
                                flag = true;
                                break;
                            }
                        }
                        //k遍历到头找不到不为空的
                        if(k==4 && block[i][3]==null){
                            j=4;
                            continue;
                        }
                    }
                    //不是第0个元素 相邻的两个值相等 不是空
                    if(j!=0 && block[i][j].value == block[i][j-1].value && block[i][j] != null){
                        //已存在的两个方块移动到目标位置
                        block[i][j].y= j-1;
                        block[i][j].drawBlock();
                        //生成新方块，同时将旧方块标记为待删除状态
                        deleteBlock.push(block[i][j]);
                        deleteBlock.push(block[i][j-1]);
                        block[i][j-1] = new Block(i,j-1,block[i][j-1].value*2,0);
                        block[i][j] = null;
                        j--;
                        flag = true;
                        score+=block[i][j].value;
                    }
                }
            }
        break;
    }
    //每次移动完需要新添一个块,没移动则不新添
    if(flag) newCell(block);
    //如果有分数产生则修改最高分
    if(score!=0){
        updateScore(score);
    }
}

function updateScore(score){
    totalScore+=score;
    var bestScore = document.getElementById("best-score");
    var nowScore = document.getElementById("now-score");
    nowScore.innerHTML = '+'+score;
    load();

    //动画
    function load(){
        //满足某个条件时始终运行
        if(parseInt(bestScore.innerHTML)>totalScore){
            bestScore.innerHTML=parseInt(bestScore.innerHTML)-10;
            var c=requestAnimationFrame(load);
        }else if(parseInt(bestScore.innerHTML)<totalScore){
            bestScore.innerHTML=parseInt(bestScore.innerHTML)+1;
            var c=requestAnimationFrame(load);
        }else {
            cancelAnimationFrame(c);
        }
    }
}

// var game = [
//     [0,0,0,0],
//     [0,0,0,0],
//     [0,0,0,0],
//     [0,0,0,0]
// ]
var totalScore = 0;
var block = [
    [null,null,null,null],
    [null,null,null,null],
    [null,null,null,null],
    [null,null,null,null]
];

var deleteBlock = [];
//游戏的主入口，开始新游戏前先清除棋盘

alert("最近更新：\n\
2022-3-31：\n\
1.新增分数的计算\n\
2.游戏失败的判定\n\
2022-7-31:\n\
1.新增对胜利的判定\n\
2.调整为七夕玩法\n\
2022-8-2:\n\
1.添加了触摸屏的玩法,但电脑体验最佳\n\
2022-9-4:\n\
1.改变为普通玩法\n\
")
var EventUtil = {
    addHandler: function (element, type, handler) {
        if (element.addEventListener)
            element.addEventListener(type, handler, false);
        else if (element.attachEvent)
            element.attachEvent("on" + type, handler);
        else
            element["on" + type] = handler;
    },
    removeHandler: function (element, type, handler) {
        if(element.removeEventListener)
            element.removeEventListener(type, handler, false);
        else if(element.detachEvent)
            element.detachEvent("on" + type, handler);
        else
            element["on" + type] = handler;
    },
    /**
     * 监听触摸的方向
     * @param target            要绑定监听的目标元素
     * @param isPreventDefault  是否屏蔽掉触摸滑动的默认行为（例如页面的上下滚动，缩放等）
     * @param upCallback        向上滑动的监听回调（若不关心，可以不传，或传false）
     * @param rightCallback     向右滑动的监听回调（若不关心，可以不传，或传false）
     * @param downCallback      向下滑动的监听回调（若不关心，可以不传，或传false）
     * @param leftCallback      向左滑动的监听回调（若不关心，可以不传，或传false）
     */
    listenTouchDirection: function (target, isPreventDefault, upCallback, rightCallback, downCallback, leftCallback) {
        this.addHandler(target, "touchstart", handleTouchEvent);
        this.addHandler(target, "touchend", handleTouchEvent);
        this.addHandler(target, "touchmove", handleTouchEvent);
        var startX;
        
        var startY;
        function handleTouchEvent(event) {
            switch (event.type){
                case "touchstart":
                    startX = event.touches[0].pageX;
                    startY = event.touches[0].pageY;
                    break;
                case "touchend":
                    var spanX = event.changedTouches[0].pageX - startX;
                    var spanY = event.changedTouches[0].pageY - startY;

                    if(Math.abs(spanX) > Math.abs(spanY)){      //认定为水平方向滑动
                        if(spanX > 30){         //向右
                            if(rightCallback)
                                rightCallback();
                        } else if(spanX < -30){ //向左
                            if(leftCallback)
                                leftCallback();
                        }
                    } else {                                    //认定为垂直方向滑动
                        if(spanY > 30){         //向下
                            if(downCallback)
                                downCallback();
                        } else if (spanY < -30) {//向上
                            if(upCallback)
                                upCallback();
                        }
                    }
                    break;
                case "touchmove":
                    //阻止默认行为
                    if(isPreventDefault){
                        event.preventDefault();
                        console.log('stop')
                    }
                    break;
            }
        }
    }
};
function up(){
    console.log("action:up");
    move(0,block,deleteBlock);
    for(let e of deleteBlock){
        e.e.remove();
        console.log(e);
    }
    deleteBlock.length = 0;
}
function right(){
    console.log("action:right");
    move(1,block,deleteBlock);
    for(let e of deleteBlock){
        e.e.remove();
        console.log(e);
    }
    deleteBlock.length = 0;
}
function down(){
    console.log("action:down");
    move(2,block,deleteBlock);
    for(let e of deleteBlock){
        e.e.remove();
        console.log(e);
    }
    deleteBlock.length = 0;
}
function left(){
    console.log("action:left");
    move(3,block,deleteBlock);
    for(let e of deleteBlock){
        e.e.remove();
        console.log(e);
    }
    deleteBlock.length = 0;
}

function main(){
    // document.getElementsByTagName("body")[0].requestFullscreen()
    document.getElementById("endGame").style.display = "none";
    alert("电脑端请使用W，A，S，D来游玩, 手机端请上下左右滑动屏幕来游玩");
    totalScore = 0;
    updateScore(0);
    console.log(deleteBlock);
    for(let e of deleteBlock){
        e.e.remove();
        console.log(e);
    }
    deleteBlock.length = 0;
    for(let i=0;i<4;i++){
        for(let j=0;j<4;j++){
            if(block[i][j]!=null){
                block[i][j].e.remove();
                block[i][j] = null;
            }
        }
    }
    newCell(block,2);
    newCell(block,2);
    //使用的时候很简单，只需要向下面这样调用即可
    //其中下面监听的是整个DOM
    //up, right, down, left为四个回调函数，分别处理上下左右的滑动事件
    EventUtil.listenTouchDirection(document, true, up, right, down, left)
    //监听键盘
    //设置标志，键盘可以按下为true，按下一次换为false，防止一次按键多次事件
    var flag = true;
    document.onkeydown = (
        function(event){
            //W:87 D:68 S:83 A:65
            //上:33 右:35 下:34 左:36
            console.log(event.keyCode);
            if(flag){
                switch(event.keyCode){
                    case 38:
                    case 87:move(0,block,deleteBlock);break;
                    case 39:
                    case 68:move(1,block,deleteBlock);break;
                    case 40:
                    case 83:move(2,block,deleteBlock);break;
                    case 37:
                    case 65:move(3,block,deleteBlock);break;
                }
                flag = false;
            }
        }
    );

    document.onkeyup = (
        function(event){
            //W:87 D:68 S:83 A:65
            //上:33 右:35 下:34 左:36
            switch(event.keyCode){
                case 38:
                case 39:
                case 40:
                case 37:
                case 87:
                case 68:
                case 83:
                case 65:
                    for(let e of deleteBlock){
                        e.e.remove();
                        console.log(e);
                    }
                    deleteBlock.length = 0;
                break;
            }
            flag = true;
        }
    )

    //失败判断,失败返回true
    function faile(){
        for(i=0;i<3;i++){
            for(j=0;j<3;j++){
                if(block[i][j] == null || block[i][j+1] == null || block[i+1][j] == null || block[i+1][j+1] == null){
                    return false;
                }
                if(block[i][j].value == block[i][j+1].value || block[i][j].value == block[i+1][j].value
                    || block[i+1][j].value == block[i+1][j+1].value || block[i][j+1].value == block[i+1][j+1].value){
                    return false;
                }
            }
        }
        return true;
    }
    load();
    //监听游戏是否失败
    function load(){
        //满足某个条件时始终运行
        if(!faile()){
            var c=requestAnimationFrame(load);
        }else {
            document.getElementById("endGame").style.display = "block";
            document.getElementById("endScore").innerHTML= totalScore;
            console.log(block);
            cancelAnimationFrame(c);
        }
    }
}
// main();