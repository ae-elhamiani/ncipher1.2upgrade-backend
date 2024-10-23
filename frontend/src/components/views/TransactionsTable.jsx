import React from 'react';
import { Loader2, ExternalLink } from 'lucide-react';

const TransactionsTable = ({ transactions, isLoading, lastUpdate, formatBNB, formatTime }) => {
    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded z-10">
                    <Loader2 className="w-8 h-8 text-[#26BAB4] animate-spin" />
                </div>
            )}
            <div className={`w-full overflow-x-auto bg-[#070C10] rounded border-[0.5px] border-[#747474aa] transition-opacity duration-200 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                <div className="flex justify-between items-center px-4 py-3 border-b-[0.5px] border-[#747474aa]">
                    <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-[#26BAB4]'}`} />
                        <span className="text-gray-400 font-[RobotoMono] text-sm">
                            {isLoading ? 'Refreshing data...' : 'Live Monitoring'}
                        </span>
                    </div>
                    {lastUpdate && (
                        <span className="text-gray-400 font-[RobotoMono] text-sm">
                            Last updated: {lastUpdate}
                        </span>
                    )}
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b-[0.5px] border-[#747474aa] bg-[#0D1117]">
                            <th className="p-4 text-gray-400 font-[RobotoMono] text-[14px] font-medium">TX Hash</th>
                            <th className="p-4 text-gray-400 font-[RobotoMono] text-[14px] font-medium">Amount (BNB)</th>
                            <th className="p-4 text-gray-400 font-[RobotoMono] text-[14px] font-medium">From</th>
                            <th className="p-4 text-gray-400 font-[RobotoMono] text-[14px] font-medium">To</th>
                            <th className="p-4 text-gray-400 font-[RobotoMono] text-[14px] font-medium text-right">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => (
                            <tr key={tx.txHash} className="border-b-[0.5px] border-[#747474aa] hover:bg-[#1C2128]">
                                <td className="p-4">
                                    <a 
                                        href={`https://bscscan.com/tx/${tx.txHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#26BAB4] hover:text-[#01FFC2] flex items-center gap-2"
                                    >
                                        {tx.txHash.substring(0, 16)}...
                                        <ExternalLink size={14} />
                                    </a>
                                </td>
                                <td className="p-4">
                                    <span className="text-[#26BAB4] font-medium">
                                        {formatBNB(tx.amount)}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <a 
                                        href={`https://bscscan.com/address/${tx.sender}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-[#26BAB4] transition-colors"
                                    >
                                        {tx.sender.substring(0, 16)}...
                                    </a>
                                </td>
                                <td className="p-4">
                                    <a 
                                        href={`https://bscscan.com/address/${tx.receiver}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white hover:text-[#26BAB4] transition-colors"
                                    >
                                        {tx.receiver.substring(0, 16)}...
                                    </a>
                                </td>
                                <td className="p-4 text-right text-gray-400">
                                    {formatTime(tx.timestamp)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionsTable;