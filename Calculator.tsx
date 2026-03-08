import { useState } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const handleNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperation = (op: string) => {
    const currentValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }

    setOperation(op);
    setWaitingForNewValue(true);
  };

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case '+': return prev + current;
      case '-': return prev - current;
      case '×': return prev * current;
      case '÷': return prev / current;
      default: return current;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const result = calculate(previousValue, parseFloat(display), operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  return (
    <div className="flex flex-col h-full bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-900 text-white p-6">
          <div className="text-right text-5xl font-light break-words">
            {display}
          </div>
        </div>

        <div className="p-4 space-y-3">
          {buttons.map((row, rowIdx) => (
            <div key={rowIdx} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${row.length}, 1fr)` }}>
              {row.map((btn) => (
                <button
                  key={btn}
                  onClick={() => {
                    if (btn === 'C') handleClear();
                    else if (btn === '=') handleEquals();
                    else if (btn === '.') handleDecimal();
                    else if (['+', '-', '×', '÷'].includes(btn)) handleOperation(btn);
                    else if (btn === '±') setDisplay(String(-parseFloat(display)));
                    else if (btn === '%') setDisplay(String(parseFloat(display) / 100));
                    else handleNumber(btn);
                  }}
                  className={`h-14 rounded-lg font-semibold text-lg transition-colors ${
                    ['+', '-', '×', '÷', '='].includes(btn)
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : btn === 'C'
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
