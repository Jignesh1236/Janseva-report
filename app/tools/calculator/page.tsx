
"use client";
import React, { useState } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleScientific = (func: string) => {
    const value = parseFloat(display);
    let result: number;

    switch (func) {
      case 'sin':
        result = Math.sin(value * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(value * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(value * Math.PI / 180);
        break;
      case 'log':
        result = Math.log10(value);
        break;
      case 'ln':
        result = Math.log(value);
        break;
      case 'sqrt':
        result = Math.sqrt(value);
        break;
      case 'square':
        result = value * value;
        break;
      case 'factorial':
        result = factorial(Math.floor(value));
        break;
      default:
        return;
    }

    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    let result = 1;
    for (let i = 1; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const Button = ({ onClick, className = '', children }: any) => (
    <button
      onClick={onClick}
      className={`h-16 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Scientific Calculator</h1>
          <p className="text-lg text-gray-600">Advanced calculator with scientific functions</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          {/* Display */}
          <div className="bg-gray-900 text-white p-4 rounded-lg mb-4 text-right">
            <div className="text-3xl font-mono overflow-hidden">{display}</div>
          </div>

          {/* Scientific Functions */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <Button onClick={() => handleScientific('sin')} className="bg-blue-200 hover:bg-blue-300">sin</Button>
            <Button onClick={() => handleScientific('cos')} className="bg-blue-200 hover:bg-blue-300">cos</Button>
            <Button onClick={() => handleScientific('tan')} className="bg-blue-200 hover:bg-blue-300">tan</Button>
            <Button onClick={() => handleScientific('log')} className="bg-blue-200 hover:bg-blue-300">log</Button>
            <Button onClick={() => handleScientific('ln')} className="bg-blue-200 hover:bg-blue-300">ln</Button>
            <Button onClick={() => handleScientific('sqrt')} className="bg-blue-200 hover:bg-blue-300">√</Button>
            <Button onClick={() => handleScientific('square')} className="bg-blue-200 hover:bg-blue-300">x²</Button>
            <Button onClick={() => handleScientific('factorial')} className="bg-blue-200 hover:bg-blue-300">x!</Button>
          </div>

          {/* Basic Calculator */}
          <div className="grid grid-cols-4 gap-2">
            <Button onClick={clear} className="bg-red-200 hover:bg-red-300">C</Button>
            <Button onClick={() => setDisplay(display.slice(0, -1) || '0')}>⌫</Button>
            <Button onClick={() => performOperation('÷')} className="bg-orange-200 hover:bg-orange-300">÷</Button>
            <Button onClick={() => performOperation('×')} className="bg-orange-200 hover:bg-orange-300">×</Button>

            <Button onClick={() => inputNumber('7')}>7</Button>
            <Button onClick={() => inputNumber('8')}>8</Button>
            <Button onClick={() => inputNumber('9')}>9</Button>
            <Button onClick={() => performOperation('-')} className="bg-orange-200 hover:bg-orange-300">-</Button>

            <Button onClick={() => inputNumber('4')}>4</Button>
            <Button onClick={() => inputNumber('5')}>5</Button>
            <Button onClick={() => inputNumber('6')}>6</Button>
            <Button onClick={() => performOperation('+')} className="bg-orange-200 hover:bg-orange-300">+</Button>

            <Button onClick={() => inputNumber('1')}>1</Button>
            <Button onClick={() => inputNumber('2')}>2</Button>
            <Button onClick={() => inputNumber('3')}>3</Button>
            <Button onClick={() => performOperation('=')} className="bg-green-200 hover:bg-green-300 row-span-2">=</Button>

            <Button onClick={() => inputNumber('0')} className="col-span-2">0</Button>
            <Button onClick={inputDecimal}>.</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
