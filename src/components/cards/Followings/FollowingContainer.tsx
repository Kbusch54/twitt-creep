'use client'
import React, { useState, useEffect } from 'react'
import FollowingCard from './FollowingCard'
import { getAllFollowings, getAllFollowingsForFalse, getAllFollowingsForNull, getLastUpdated, getTracking, massAdoption } from '@/components/utils/supabase'
import { useRouter } from 'next/navigation'
import Add from '@/components/buttons/Add'
import ListLength from './ListLength'
import Ignore from '@/components/buttons/Ignore'
import Link from 'next/link'

interface Props {
    accts: any[]
    listStatus: boolean | null
}

const FollowingContainer: React.FC<Props> = ({ accts, listStatus }) => {
    const [following, setFollowing] = useState<any>(accts);
    const [tracked, setTracked] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updated, setUpdated] = useState<any>('');

    const timeOfDate = updated ? new Date(updated).getTime() : 0;
    const router = useRouter();



    const getData = async () => {
        const res = await getTracking()
        setTracked(res);
        if (listStatus == null) {

            const res2 = await getAllFollowingsForNull();
            setFollowing(res2);
        } else if (listStatus == true) {
            const res2 = await getAllFollowings();
            setFollowing(res2);
        } else {
            const res2 = await getAllFollowingsForFalse();
            setFollowing(res2);
        }
        const lastUpdated = await getLastUpdated();
        // @ts-ignore
        setUpdated(lastUpdated[0].last_updated);

        setIsLoading(false);
    }
    useEffect(() => {
        getData();
        return () => {
            // here you can clean the effect in case the component gets unmonth before the async function ends
        }
    }, [])
    const getList = () => {
        let listOfAccts: any[] = [];
        following.forEach((item: { jk_follows: boolean | null, account: string }) => {
            if (item.jk_follows == listStatus) {
                listOfAccts.push(item);
            }
        })
        return listOfAccts;
    }
    const addAll = async () => {
        massAdoption(getList(), true).then((res) => {
            reload();
        }).catch((err) => {
            console.log(err);
            reload();
        })
    }
    const ignoreAll = async () => {
        massAdoption(getList(), false).then((res) => {
            reload();
        }).catch((err) => {
            console.log(err);
            reload();
        })
    }
    const reload = async () => {

        await getData();
    }
    if (isLoading) {
        return (
            <div className='2xl:col-start-2 col-span-1'>
                <h1 className='text-amber-400 text-5xl text-center my-2'>List Length <span className='animate-pulse text-gray-400'>000</span></h1>
                <div className='flex flex-row flex-wrap justify-center '>


                    <div className=' w-full h-44 bg-gray-200 text-center rounded-2xl m-1 relative animate-pulse opacity-5'>

                    </div>
                    <div className=' w-full h-44 bg-gray-200 text-center rounded-2xl m-1 relative animate-pulse opacity-5'>

                    </div>
                    <div className=' w-full h-44 bg-gray-200 text-center rounded-2xl m-1 relative animate-pulse opacity-5'>

                    </div>
                </div>
            </div>
        )
    }
    return (
        <>
            <ListLength loading={isLoading} following={following} updated={updated} listStatus={listStatus} />
            <hr />
            <div className=' '>
                {window.location.href.endsWith('application') && (
                    <div className='flex flex-row justify-center'>
                        <button onClick={ignoreAll} className='p-8 bg-red-500 rounded-full text-white text-5xl m-4 hover:scale-150 border-4 border-white'>Ignore All</button>
                    </div>
                )}
                {following.map((item: { jk_follows: string | boolean | null; account: string; username: string; description: string | null; created_at: string; followed_by: string[] }, index: any) => (
                    <>
                        {listStatus == item.jk_follows ? (
                            <div className='grid mx-12 grid-cols-1 2xl:grid-cols-12 my-2 '>
                                <div className='hidden 2xl:flex 2xl:col-start-1 2xl:col-span-3 m-4'>

                                    {/* <Ignore username={item.account} reload={reload} state={item.jk_follows} size={true} />
                                                <div>
                                            */}
                                    {item.followed_by && (
                                        <div className='bg-amber-500 text-2xl text-center text-white w-full h-full mr-1 rounded-xl hover:scale-110'>

                                            <p className='text-white'>Tracked by</p>
                                            <p className='text-purple-700'>
                                                <Link href={`https://twitter.com/${item.followed_by[0]}`} target='blank' >
                                                    {item.followed_by[0]}

                                                </Link>
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className='col-span-1  2xl:col-start-4 2xl:col-span-6 2xl:mx-24 '>
                                    {/* @ts-ignore */}
                                    <FollowingCard reload={reload} key={(item.account + item.username).replace(/\n/g, ' ').replace('@', '')} bio={item.description} createdAt={item.created_at} name={item.account} username={item.username} followers={item.followed_by} tracked={tracked} state={item.jk_follows} />
                                </div>
                                <div className='hidden 2xl:flex 2xl:col-start-10 2xl:col-span-3 m-4'>

                                    <Add username={item.account} reload={reload} state={item.jk_follows} size={true} />
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                    </>
                ))}
            </div>

        </>
    )
}

export default FollowingContainer
