"use client"

import Image from "next/image";
import { useState, useEffect } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot } from "lucide-react"

import axios from "axios"

import { LiveSessionType, MetricType } from "./types"
import { PositionType } from "../types"


import ListSessionComponent from "./components/listSession"
import MetricsSession from "./components/metricsSession"
import PositionsOpen from "./components/positionsOpen"





export default function LiveSession () {


    const [loadingSessions, setLoadingSession] = useState(false);
    const [liveSessions, setLiveSessions] = useState<LiveSessionType[]>([]);

    const [positions, setPositions] = useState<PositionType[]>([]);
    const [loadingPositions, setLoadingPositions] = useState(false)

    const [showOnlyRunning, setShowOnlyRunning] = useState(true);
    
    const filteredSessions = showOnlyRunning
        ? liveSessions.filter(session => session.status === 'running') // Se o checkbox estiver marcado
        : liveSessions;
    

    const getSessions = async () => {

        try {
            setLoadingSession(true);
            const sessionsResults = await axios.get('/api/live-session/list', {
                params: {
                    environment: 'mainnet'
                }
            })
            setLiveSessions(sessionsResults.data.sessions)
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingSession(false);
        }
    }

    const getPositions = async () => {

        try {
            setLoadingPositions(true);
            const positionsResult = await axios.get('/api/binance/positions/open', {
                params: {
                    environment: 'mainnet'
                }
            });
            // console.log(positionsResult.data.positions)
            setPositions(positionsResult.data.positions)

        } catch (err) {
            console.error(err)
        } finally {
            setLoadingPositions(false)
        }
    }


    useEffect(() => {
        
        getSessions();
        getPositions();

    }, []);



    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold flex items-center gap-2">
                        <Bot className="h-6 w-6" />
                        Live Session
                    </h1>
                    {/* <p className="text-muted-foreground">{currentTime}</p> */}
                </div>

                <div className="flex items-center justify-center h-30 w-100 ">
                    <Image
                        src="/logo-transparante-2.png"
                        alt="AlgoQuant Logo"
                        width={290}
                        height={10}
                    />
                </div>
                
            </div>

            

            {/* Live Metrics */}
            <MetricsSession 
                sessions={filteredSessions}
                positions={positions}
            />

            <Tabs defaultValue="strategies" className="space-y-4">

                <TabsList>
                    <TabsTrigger className="cursor-pointer" value="strategies">Estratégias Ativas</TabsTrigger>
                    <TabsTrigger className="cursor-pointer" value="positions">Posições Live</TabsTrigger>
                </TabsList>

                <TabsContent value="strategies" className="space-y-4">
                    <ListSessionComponent 
                        liveSessions={filteredSessions}
                        showOnlyRunning={showOnlyRunning}
                        setShowOnlyRunning={setShowOnlyRunning}
                    />
                </TabsContent>

                <TabsContent value="positions" className="space-y-4">
                    <PositionsOpen 
                        positions={positions}
                        loading={loadingPositions}
                    />
                </TabsContent>

            </Tabs>
        </div>
    )
}