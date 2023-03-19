const express = require('express'); //Import the express dependency
const port = 5555;                  //Save the port number where your server will be listening
const app = express();//Instantiate an express app, the main work horse of this server
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
app.use('/CSS', express.static(__dirname + "/CSS"));

let board=[];
let turn = 1;
createBoard();

const router = express.Router();
let cnt=0;
let LastMove={}
router.get('/GetLast',function(req,res){
  res.send(LastMove);
});
router.get('/GetMove/:p/:c',function(req,res){
  let plyr=Number(req.params.p);
  let col =Number(req.params.c);
  if(turn === plyr)
  {
    dropCoin(col,plyr);
    if(turn === 1){
      turn = 2;
    }else{
      turn = 1;
    }
    res.send(LastMove);
  }   
});
router.get('/', (req, res) => {        //get requests to the root ("/") will route here
      cnt++;
      if(cnt > 2){
        cnt = 1;
      }
      res.render("index", {
      timesShown: cnt,
    });
                                                  //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});


//add the router
app.use('/', router);


app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});

function createBoard(){
  for(let r=0;r<6;r++){
    board[r]=[];
    for(let c=0;c<7;c++){
      board[r][c]=0;
    }
  }
}
function dropCoin(col,plyr){
  for(let r=board.length-1;r>=0;r--){
    if(board[r][col]==0){
      board[r][col]=plyr;
      LastMove.row=r;
      LastMove.col=col;
      LastMove.plyr=plyr;
      Winner(col,plyr);
      break;
    }
  }
}
// ((stepPlyr1[stepPlyr1.length - 1] / 10) - 1) < two || ((stepPlyr1[stepPlyr1.length - 1] % 10) + 1) > one
function Winner(col,plyr){
  let countRow = 1;
  let countCol = 1;
  let countslant = 1;
  let countslant2 = 1;
  let keys = [];

   for(let r = board.length-1; r > 0; r--){
    for(let c = 0; c < board[0].length - 1; c++){
      if(board[r][c] === board[r][c+1] && (board[r][c] === plyr)){
        countRow++;
      }
      if(board[r][c] === board[r-1][c+1] && (board[r][c] === plyr) && (r !== keys[0]) && (c !== keys[1])){
        keys[0] = r;
        keys[1] = c;
        countslant++;
        if(plyr !== board[r-1][c+1]){
          countslant = 1;
        }
      }else if((board[r][c] === board[r-1][c-1] && c !== 0) && board[r][c] === plyr){
        keys[0] = r;
        keys[1] = c;
        countslant2++;
        if(plyr !== board[r-1][c-1]){
          countslant2 = 1;
        }
      } 

      if(board[r][c] !== board[r][c+1]){
        if(countRow === 4){
          LastMove.winner = plyr;
        }  
        countRow = 1;
      }
    }

    if(board[r][col] ===  board[r-1][col] && (board[r][col] === plyr)){
      countCol++;
    }
      
   /* if(countRow === 4){
      LastMove.winner = plyr;
      break;
    }else{
      countRow = 1;
    }*/
   }
   
   if((countCol === 4) || (countslant === 4) || (countslant2 === 4)){
      LastMove.winner = plyr;
    }else{
      countCol = 1;
    }
  
}