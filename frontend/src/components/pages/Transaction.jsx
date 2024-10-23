import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../common/Navbar';
import IntervalForm from '../views/IntervalForm';
import TransactionsTable from '../views/TransactionsTable';

const Transactions = () => {
    const [minutes, setMinutes] = useState('1');
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:5001/api/bitquery/whale-transactions');
            if (response.data.success) {
                setTransactions(response.data.data);
                setLastUpdate(new Date().toLocaleTimeString());
                setError(null);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to fetch transactions');
        }
        setIsLoading(false);
    };

    const setupCronJob = async (intervalMinutes) => {
        try {
            const response = await axios.post('http://localhost:5001/api/bitquery/set-interval', {
                minutes: intervalMinutes
            });
            
            if (response.data.success) {
                setError(null);
            }
        } catch (error) {
            console.error('Cron Setup Error:', error);
            setError('Failed to set monitoring interval');
            setIsRunning(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        let intervalId;

        if (isRunning) {
            intervalId = setTimeout(function run() {
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                }
                else if (minutes > 0) {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
                else {
                    fetchData();
                    const initialMinutes = parseInt(minutes) || 1;
                    setMinutes(initialMinutes - 1);
                    setSeconds(59);
                }
                intervalId = setTimeout(run, 1000);
            }, 1000);
        }

        return () => clearTimeout(intervalId);
    }, [isRunning, minutes, seconds]);

    const startTimer = async () => {
        const mins = parseInt(minutes);
        if (mins > 0) {
            try {
                await setupCronJob(mins);
                setMinutes(mins - 1);
                setSeconds(59);
                setIsRunning(true);
                fetchData();
            } catch (error) {
                setError('Failed to start monitoring');
            }
        }
    };

    const stopTimer = async () => {
        try {
            await axios.post('http://localhost:5001/api/bitquery/set-interval', { minutes: 0 });
            setIsRunning(false);
            const mins = parseInt(minutes);
            setMinutes(mins.toString());
            setSeconds(0);
            setError(null);
        } catch (error) {
            setError('Failed to stop monitoring');
        }
    };

    const formatBNB = (amount) => {
        const num = parseFloat(amount);
        return num.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-[#070C10] text-white">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-white mb-6 font-[Nippo] text-center">
                    Transactions
                </h1>

                <IntervalForm
                    minutes={minutes}
                    seconds={seconds}
                    isRunning={isRunning}
                    lastUpdate={lastUpdate}
                    error={error}
                    setMinutes={setMinutes}
                    onStart={startTimer}
                    onStop={stopTimer}
                />

                <TransactionsTable
                    transactions={transactions}
                    isLoading={isLoading}
                    lastUpdate={lastUpdate}
                    formatBNB={formatBNB}
                    formatTime={formatTime}
                />
            </div>
        </div>
    );
};

export default Transactions;