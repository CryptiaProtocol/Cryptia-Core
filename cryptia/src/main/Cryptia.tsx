import Navmain from './Navmain'
import Cr from './Cr'
import Instruction from './Instruction'
import Trx from './Trx'
import React, { createContext, useMemo, useState } from 'react';



type Props = {}


interface ContextValue {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean | any>>;
    connectWallet(): void;
    chainid: string | null ;
    contractAddress : string
};



export const AppContext = createContext<ContextValue | any>(null)
const Cryptia = (props: Props) => {

    const [show, setShow] = useState<boolean>(true);
    const [, setwallet] = useState<boolean>(false);
    const [chainid, setchainid] = useState<string | null>('');
    let contractAddress : string ='0x6340e1ed7DCe39ccA016C1805286Aa11536b4F3a'

    let chainId: string;

    const { ethereum }: any = window;

    const accountChecker = async () => {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];
        sessionStorage.setItem('address', address);


    };

    useMemo(() => {
        if (ethereum) {
            ethereum.on('accountsChanged', () => {
                accountChecker();
                window.location.reload()

            })
        }
        ethereum.on('chainChanged' || 'accountsChanged', (chId: any) => {
            console.log(chId)
            if (chId !== '0x1e15') {
                console.log('plz connect to canto testnet')
                return
            }
            window.location.reload()

        })

    }, [])





    const connectWallet = async (): Promise<void> => {
        if (ethereum === undefined) {
            alert('Plz install metamask')
            return;
        }
        try {
            if (ethereum) {
                const accounts = await ethereum.request({ method: "eth_requestAccounts" })
                sessionStorage.setItem('address', accounts[0]);

                chainId = await ethereum.request({ method: "eth_chainId" })
                setchainid(chainId)
                console.log(chainId)


                if (chainId !== '0x1e15') {
                    alert('plz connect to canto testnet')
                }
            }
            setwallet(true)

        }
        catch (error) {
            console.log('Error:', error);
        }
    };






    const ContextValue: ContextValue = {
        show,
        setShow,
        connectWallet,
        chainid,
        contractAddress
    };

    return (
        <AppContext.Provider value={ContextValue}>
            <div >
                <Navmain />
                <Cr />

                <div>
                    <Instruction />
                    <Trx />
                </div>
            </div>
        </AppContext.Provider>
    )
}

export default Cryptia