
'use client';
import Link from 'next/link';
import Wedo_Logo from "../../public/Wedo_logo_T.png"
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export const Header = () => {

    const [mounted, setMounted] = useState(false);
    const { token, user } = useSelector(state => state.userSlice);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // Prevent hydration mismatch

    // console.log(user?.name);

    return (
        <header className='border border-bottom'>
            <nav className=" navbar navbar-expand-lg bg-body-tertiary">
                <div className="container">
                    <Link className="navbar-brand rounded  p-0" style={{ maxWidth: "10rem", overflow: "hidden" }} href="/dashboard" >
                        <Image src={Wedo_Logo}
                            alt="Wedo logo image"
                            className='w-100 h-100 rounded img-fluid border'
                            priority

                        />
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Offcanvas</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <div className="navbar-nav justify-content-end flex-grow-1 pe-3">
                                {
                                    token !== null && user ? (<div className=''>
                                        <div className=''>
                                            <Link href={"/dashboard"}  >
                                                {/* <Image
                                                    // src={user?.profileImage}
                                                    src={`https://api.dicebear.com/5.x/initials/svg?seed=${user?.name}`}
                                                    // src={`https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(user?.name)}`}

                                                    width={100}
                                                    height={100}
                                                    className="rounded-circle w-100 h-100 border"
                                                    alt='user profile image'
                                                /> */}
                                                <div className='rounded-circle ' style={{ maxWidth: "2.5rem" }}>

                                                    <img
                                                        src={`https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                                                        className="rounded-circle border w-100 h-100 object-fit-cover "
                                                        alt="user profile image"

                                                    />
                                                </div>
                                            </Link>
                                        </div>
                                    </div>) :
                                        (
                                            <div className='d-flex gap-3'>
                                                {/* <div>
                                                    <Link href={"/login"} className='btn fw-semibold btn-outline-dark'>
                                                        Login
                                                    </Link>
                                                </div> */}
                                            </div>
                                        )
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}