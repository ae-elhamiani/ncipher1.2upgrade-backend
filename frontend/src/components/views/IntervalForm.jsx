import React from 'react';
import { AlertCircle } from 'lucide-react';

const IntervalForm = ({ 
    minutes,
    seconds,
    isRunning,
    lastUpdate,
    error,
    setMinutes,
    onStart,
    onStop 
}) => {
    const handleMinutesChange = (e) => {
        setMinutes(e.target.value);
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-8 bg-[#070C10] p-6 rounded border-[0.5px] border-[#747474aa]">
            <p className="font-[RobotoMono] text-[15px] text-white mb-6">
                Enter the interval in minutes
            </p>
            <div className="flex gap-4 mb-4 items-center">
                <div className="flex-grow relative">
                    <input
                        type="number"
                        value={minutes}
                        onChange={handleMinutesChange}
                        className="w-full p-2 bg-[#1C2128] border-[0.5px] border-[#747474aa] rounded text-white font-[RobotoMono] 
                        focus:outline-none focus:border-[#26BAB4] transition-colors"
                        min="1"
                        placeholder="Enter interval"
                    />
                </div>
                <button
                    onClick={isRunning ? onStop : onStart}
                    className="clipButton font-[Nippo] w-[130px] h-[40px] flex items-center justify-center
                    bg-gradient-to-r from-[#5AB0FF] to-[#01FFC2]"
                >
                    {isRunning ? 'Stop' : 'Start'}
                </button>
            </div>
            {error && (
                <div className="mt-2 text-red-400 flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span className="text-sm">{error}</span>
                </div>
            )}
            {isRunning && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-[#26BAB4] rounded-full animate-pulse"></div>
                        <p className="text-gray-400 font-[RobotoMono] text-[14px]">
                            Next refresh in{' '}
                            <span className="text-[#26BAB4] font-bold">
                                {minutes}:{seconds.toString().padStart(2, '0')}
                            </span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IntervalForm;