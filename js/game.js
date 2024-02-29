function sleep(time){
    var startTime = new Date().getTime();
    while(new Date().getTime() <= time+startTime)
    {
        
    }
}
win = false;
map = {
    2: "陌生人",
    4: "一面之交",
    8: "同学",
    16: "朋友",
    32: "好朋友",
    64: "知己",
    128: "暧昧",
    256: "恋人",
    512: "热恋",
    1024: "结婚",
    2048: "老伴",
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
")
function main(){
    // document.getElementsByTagName("body")[0].requestFullscreen()
    document.getElementById("endGame").style.display = "none";
    alert("请使用W，A，S，D来游玩");
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