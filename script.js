"use strict" ;

const input = document.querySelector('.header__input') ;
const equalButton = document.querySelector('.equal-button') ;
const history = document.querySelector('.header__history') ;
const errorMessage = document.querySelector('.header__error') ;

const numberButtons = document.querySelectorAll('.number-button') ;
const deleteButton = document.querySelector('.clear-button') ;
const acButton = document.querySelector('.ac-button') ;
const plusMinusButton = document.querySelector('.plus-minus-button') ;

let dotCheck = false ; 
let sessionObj = JSON.parse(sessionStorage.getItem('sessionObj')) || {
    inputField: '' ,
    historyField: ''
} ;

if (sessionObj.inputField) {
    input.value = sessionObj.inputField ;
    history.innerText = sessionObj.historyField ;
}

const addSessionObj = (inputValue) => {
    sessionObj.inputField = inputValue ;
    sessionStorage.setItem('sessionObj', JSON.stringify(sessionObj)) ;
} ;

input.addEventListener('keydown', (event) => {
    const key = event.key ;

    if (key == '*' || key == '/' || key == '+' || key == '-' || key == '%') {
        functionMethod(key) ;
        event.preventDefault() ;
        return ;
    }
    else if (key == '=' || key == 'Enter') {
        equalFunction() ;
        event.preventDefault() ;
        return ;
    }

    const numberKeys = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ] ;
    if (numberKeys.includes(key)) {
        addSessionObj(key) ;
        return ;
    }

    switch (key) {
        case '0' :
            zeroBtnFunction() ;
            event.preventDefault() ;
            return ;

        case '.' : 
            dotBtnFunction();
            event.preventDefault() ;
            return ;

        case 'Shift' :
            return ;               
        case 'Backspace' :
            return ;
        case 'ArrowRight' :
            return ;    
        case 'ArrowLeft' :
            return ;    

        // case '1' :
        //     return ;
        // case '2' :
        //     return ;
        // case '3' :
        //     return ;
        // case '4' :
        //     return ;
        // case '5' :
        //     return ;
        // case '6' :
        //     return ;
        // case '7' :
        //     return ;
        // case '8' :
        //     return ;
        // case '9' :
        //     return ;
    }
    event.preventDefault() ;
}) ;

numberButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        // if (input.value.length === 18) return ;

        switch(input.value) {
            case '0':
                input.value = event.target.innerText ;
                addSessionObj(input.value) ;
                return ;

            case '-0': 
                input.value = `-${event.target.innerText}` ;
                addSessionObj(input.value) ;
                return ;
        } 
        /*
        if (input.value == '0') {
            input.value = event.target.innerText ;
            return ;
        }

        if (input.value == '-0') {
            input.value = `-${event.target.innerText}` ;
            return ;
        }
        */
        if (input.value.at(-1) == '%') {
            input.value += `*${event.target.innerText}` ;
            addSessionObj(input.value) ;
            return ;
        }
        input.value += event.target.innerText ;
        addSessionObj(input.value) ;
    }) ;
}) ;

deleteButton.addEventListener('click', () => {
    if (! input.value) return ;

    input.value = input.value.slice(0, -1) ; 
    addSessionObj(input.value) ; 

    if (! input.value) {
        history.innerText = '' ;
        sessionObj.historyField = '' ;
        sessionObj.inputField = '' ;
        sessionStorage.clear() ;
    }
}) ;

acButton.addEventListener('click', () => {
    if (! input.value) return ;
    
    input.value = '' ; 
    history.innerText = '' ;
    sessionObj.historyField = '' ;
    sessionObj.inputField = '' ;
    sessionStorage.clear() ;
}) ;

plusMinusButton.addEventListener('click', () => {
    const value = input.value ;
    if (! value) return ;
    
    if (! (value.at(0) == '-')) {
        input.value = `-${value}` ;
        addSessionObj(input.value) ;
        return ;
    }
    input.value = value.slice(1) ;
    addSessionObj(input.value) ;
}) ;

const zeroBtnFunction = () => {
    if (input.value == '0') return ;

    input.value += 0 ;
    addSessionObj(input.value) ;
} ;

const functionMethod = (text) => {
    let lastValue = input.value ;
    if (! lastValue) return ;
    lastValue = lastValue.at(- 1) ;
    
    if (text == '-' && lastValue == '*') {
        input.value += text ;
        addSessionObj(input.value) ;
        dotCheck = false ;
        return ;
    }
    
    if ((lastValue == '.' || lastValue == '+' || lastValue == '-' || lastValue == '/' || lastValue == '*')) {

        if (text == '%' && input.value.at(-2) == '%') return ;

        input.value = `${input.value.slice(0, -1)}${text}` ;
        addSessionObj(input.value) ;
        dotCheck = false ;
        return ;
    }
    
    input.value += text ;
    addSessionObj(input.value) ;
    dotCheck = false ;
}

const dotBtnFunction =  () => {
    if (! input.value) return ;

    const lastValue = input.value.at(-1) ;
    if (lastValue == '+' || lastValue == '-' || lastValue == '*' || lastValue == '/' || lastValue == '%' || dotCheck) return ;

    input.value += '.' ;
    addSessionObj(input.value) ;
    dotCheck = true ;
} ;

const equalFunction = () => {
    if (! input.value) return ;

    try {
        const previousValue = input.value ;
        input.value = eval(previousValue.replaceAll('%', '/100')) ;
        history.innerText = previousValue ;

        sessionObj.historyField = previousValue ;
        addSessionObj(input.value) ;
    }
    catch(error) {
        errorMessage.innerText = 'error' ;
        setTimeout(() => {
            errorMessage.innerText = '' ;
        }, 1500) ;
    }
} ;
equalButton.addEventListener('click', equalFunction) ;