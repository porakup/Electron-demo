const fs = require('fs'); 
const inputA = document.querySelector('[input-a]');
const inputB = document.querySelector('[input-b]');
const outputResult = document.querySelector('[result]');
const operationBtn = document.querySelectorAll('[operation]');
const loadBtn = document.querySelector('[load]');
const saveBtn = document.querySelector('[save]');

const path = './file/save.json'; 

var operation;

inputA.addEventListener('input', (e) => {
        if (e.data === '.' && e.target.value.split('.').length > 2) inputA.value = '';
})

inputB.addEventListener('input', (e) => {
        if (e.data === '.' && e.target.value.split('.').length > 2) inputB.value = '';
})


operationBtn.forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (!inputA.value || !inputB.value) return;
    operation = btn.innerText;
    setOperationActive(operation);
    btn.style.border = '5px solid green';
    calculateNumber();
  })
})

function setOperationActive(operation){
    operationBtn.forEach(btn => {
       if(operation && operation === btn.innerText) {
            btn.style.border = '5px solid green';
        }else{
            btn.style.border = '1px solid black';
        }
    });
}

function calculateNumber() {

    let sum;
    let a = parseFloat(inputA.value);
    let b = parseFloat(inputB.value);

    if (isNaN(a) || isNaN(b)) return;

    switch (operation) {
        case '+': sum = a + b; break;
        case '-': sum = a - b; break;
        case '*': sum = a * b; break;
        case '/': sum = a / b; break;
        case 'Pow': sum = getPower(a,b); break;
        default: return;
    }

    outputResult.value = getNumber(sum);
}

function getPower(a,b){
    if(b === 1){
        return a;
    }

    let sum = 0;
    for (let i = 1; i < b ; i++){
        if(sum === 0){
            sum = a*a;
        }else {
            sum = sum*a;
        }
    }

    return sum;
}

function getNumber(number) {
      
    let stringNumber = number.toString();
    let integerNumber = parseFloat(stringNumber.split('.')[0]);
    let decimalNumber = stringNumber.split('.')[1];

    let rs;

    if (isNaN(integerNumber)) {
        rs = '';
    } else {
        rs = integerNumber.toLocaleString('en', {maximumFractionDigits: 0});
    }

    if (decimalNumber != null) {
        return `${rs}.${decimalNumber}`
    } else {
        return rs
    }
}


loadBtn.addEventListener('click', (e) => {
    fs.readFile(path, "utf-8", (err, data) => {
        if (err) {
             console.log('file error=',err.toString());
             return;
        }
        let resp = JSON.parse(data.toString());
        inputA.value = resp.a;
        inputB.value = resp.b
        operation = resp.operation;
        outputResult.value = resp.result;
        setOperationActive(operation);
    })
});


saveBtn.addEventListener('click', (e) => {
    let data = {};
    data.a = inputA.value;
    data.b = inputB.value;
    data.operation = operation;
    data.result = outputResult.value
    if (!fs.existsSync('./file')){
        fs.mkdirSync('./file');
    }
    fs.writeFileSync(path, JSON.stringify(data), (err) => {
        if (err) {
            console.log(err.toString());
        }
      });
});

