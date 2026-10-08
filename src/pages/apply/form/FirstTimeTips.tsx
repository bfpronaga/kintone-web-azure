import Image from 'next/image';
import Link from 'next/link';
import React, { FC, use, useEffect, useRef, useState } from 'react';

type FirstTimeTipsProps = {
    type: string | null;
    handleContinueOnFirstTime: () => void;
};
const FirstTimeTips: FC<FirstTimeTipsProps> = ({ type, handleContinueOnFirstTime }) => {
    const [page, setPage] = useState(0);
    const [haveRead, setHaveRead] = useState(false);
    const [haveReadWaiver, setHaveReadWaiver] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
    }, [page]);

    const ConfirmType = () => {
        return (
            <div className="flex flex-col items-center justify-center p-4 md:p-0">
                <>
                    <div className="text-3xl m-5">Before you begin...</div>
                    <div className="m-3 mb-4">This is a volunteer application for:</div>
                    <div className="text-2xl text-center">{type}</div>
                    <div className="m-3 mb-8">If you're not intending for {type} please let us know.</div>
                </>

                <div className="flex justify-center flex-col">
                    <button onClick={() => setPage(1)} className="btn-wide">
                        Next
                    </button>
                    <Link href="/apply" className="btn-wide text-center">
                        Back to Top
                    </Link>
                </div>
            </div>
        );
    };
    return (
        <div ref={scrollRef} className="min-w-80 md:p-[10%] p-12 flex flex-col items-center justify-center">
            {page == 0 && <ConfirmType />}
            {page != 0 && (
                <div>
                    {page == 1 && (
                        <>
                            <DoctrinalStatement />
                            <EvangelismStatement />
                            <MessianicJudaismStatement />
                        </>
                    )}
                    {page == 2 && <TermsAndConditions type={type} />}
                    {page == 3 && <WaiverNotice />}
                    <div className="flex justify-center flex-col">
                        {page == 1 && (
                            <>
                                <button onClick={() => setPage(2)} className="btn-wide">
                                    Next
                                </button>
                                <Link href="/apply" className="btn-wide text-center">
                                    Back to Top
                                </Link>
                            </>
                        )}
                        {page === 2 && (
                            <>
                                <label className="flex justify-center items-center">
                                    <input
                                        onClick={() => setHaveRead(!haveRead)}
                                        checked={haveRead}
                                        type="checkbox"
                                        className="m-2 scale-150 text-center"
                                    />
                                    <span>I have read and agree to the above</span>
                                </label>
                                <button
                                    onClick={() => setPage(3)}
                                    aria-disabled={!haveRead}
                                    className={`${!haveRead ? 'btn-disabled-wide pointer-events-none btn-wide' : 'btn-wide'}`}
                                >
                                    Continue
                                </button>
                                <button onClick={() => setPage(1)} className="btn-wide">
                                    Back
                                </button>
                            </>
                        )}
                        {page === 3 && (
                            <>
                                <label className="flex justify-center items-center">
                                    <input
                                        onClick={() => setHaveReadWaiver(!haveReadWaiver)}
                                        checked={haveReadWaiver}
                                        type="checkbox"
                                        className="m-2 scale-150 text-center"
                                    />
                                    <span>I have read and agree to the above</span>
                                </label>
                                <button
                                    onClick={handleContinueOnFirstTime}
                                    aria-disabled={!haveRead}
                                    className={`${!haveRead ? 'btn-disabled-wide pointer-events-none btn-wide' : 'btn-wide'}`}
                                >
                                    Continue
                                </button>
                                <button onClick={() => setPage(2)} className="btn-wide">
                                    Back
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FirstTimeTips;

// for step10
export const MissionStatement = () => (
    <>
        <div className="text-2xl m-5 font-serif italic text-center">MISSION STATEMENT</div>
        <div className="mb-3 text-2xl"></div>
        <div className="m-3 mb-8 text-justify">
            Bridges For Peace (BFP): Christians supporting Israel and building relationships between Christians and Jews in Israel and around the
            world.
        </div>
        <div className="text-2xl m-5 font-serif italic text-center">EXPANDED VISION</div>
        <div className="m-3 text-justify">
            It is our desire to see Christians and Jews working side by side for better understanding and a more secure Israel.
        </div>
        <div className="m-3 text-justify">
            Founded in 1976, Bridges for Peace seeks to be a ministry of hope and reconciliation. Through programs both in Israel and worldwide, we
            are giving Christians the opportunity to actively express their biblical responsibility before God to be faithful to Israel and the Jewish
            community.
        </div>
        <div className="m-3 mb-8 text-justify">
            For too long Christians have been silent. For too long the Jewish community has had to fight its battles alone. It is time Christian
            individuals and congregations speak up for the people who gave us the Bible.
        </div>
    </>
);
export const Goals = () => (
    <section>
        <div className="text-xl md:text-2xl m-5 font-serif italic text-center">WE ARE COMMITTED TO THE FOLLOWING GOALS:</div>
        <div className="m-3 mb-8 text-left md:text-justify">
            <div className="mb-3">
                1. To encourage meaningful and supportive relationships between Christians and Jews in Israel and around the world.
            </div>
            <div className="mb-3">
                2. To educate and equip Christians to identify with Israel, the Jewish people and the biblical/Hebraic foundations of our Christian
                faith.
            </div>
            <div className="mb-3">
                3. To bless Israel and the Jewish people in Israel and worldwide through practical assistance, volunteer service and prayer.
            </div>
            <div className="mb-3">
                4. To communicate Christian perspectives to the attention of Israeli leaders and the Jewish community at large.
            </div>
            <div className="mb-8">
                5. To counter anti-Semitism worldwide and support Israel's divine, God-given right to exist in her Godgiven land.
            </div>
            <div className="text-2xl m-5 font-serif italic text-center">BASIC VOLUNTEER REQUIREMENTS</div>
            <div className="mb-3 text-left text-xl md:text-2xl">WHO IS A BFP VOLUNTEER?</div>
            <div className="m-3">
                The prophets of Israel knew that one day Gentile people would come to the land of Israel and help in its restoration. The prophet
                Isaiah mentions these Gentiles on several occasions. He refers to them as "servants" in Isaiah 56:6. They are called "servants and
                handmaids" in Isaiah 14:2. And in Isaiah 61:5, we read, "Strangers shall stand and feed your flocks, and the sons of the foreigner
                shall be your plowmen and your vinedressers."
            </div>
            <div className="m-3">
                We can see from Scripture that Gentiles do not come to Israel in a high and mighty position, but rather in the position of a servant.
                Their position is much like that of Ruth of old. She was willing to abase herself to a position lower than that of a servant girl
                (Ruth 2:13). As a result, God highly exalted her to be the great-grandmother of King David.
            </div>
            <div className="m-3 mb-8">
                There are great numbers of Christians from foreign lands in Israel today who have come here in meekness and humility to serve the
                Jewish people on behalf of God. In general, the work of volunteers is often the work that others do not wish to do. It is demanding
                and requires much patience and love. But in the end, it is also greatly rewarding.
            </div>
        </div>
    </section>
);

const TermsAndConditions = (props: { type: string | null }) => {
    return (
        <div className="p-4">
            <section className="mb-5">
                <div className="text-2xl md:text-3xl m-1 font-serif text-center">OUR VISION</div>
                <div className="text-2xl m-5 font-serif italic text-center">MISSION STATEMENT</div>
                <div className="mb-3 text-2xl"></div>
                <div className="m-3 mb-8 text-justify">
                    Bridges For Peace (BFP): Christians supporting Israel and building relationships between Christians and Jews in Israel and around
                    the world.
                </div>
                <div className="text-2xl m-5 font-serif italic text-center">EXPANDED VISION</div>
                <div className="m-3 text-justify">
                    It is our desire to see Christians and Jews working side by side for better understanding and a more secure Israel.
                </div>
                <div className="m-3 text-justify">
                    Founded in 1976, Bridges for Peace seeks to be a ministry of hope and reconciliation. Through programs both in Israel and
                    worldwide, we are giving Christians the opportunity to actively express their biblical responsibility before God to be faithful to
                    Israel and the Jewish community.
                </div>
                <div className="m-3 mb-8 text-justify">
                    For too long Christians have been silent. For too long the Jewish community has had to fight its battles alone. It is time
                    Christian individuals and congregations speak up for the people who gave us the Bible.
                </div>
            </section>
            <section className="mb-5 text-justify">
                <div className="mb-3 text-left text-xl md:text-2xl">WE ARE COMMITTED TO THE FOLLOWING GOALS:</div>
                <div className="mb-3">
                    1. To encourage meaningful and supportive relationships between Christians and Jews in Israel and around the world.
                </div>
                <div className="mb-3">
                    2. To educate and equip Christians to identify with Israel, the Jewish people and the biblical/Hebraic foundations of our
                    Christian faith.
                </div>
                <div className="mb-3">
                    3. To bless Israel and the Jewish people in Israel and worldwide through practical assistance, volunteer service and prayer.
                </div>
                <div className="mb-3">
                    4. To communicate Christian perspectives to the attention of Israeli leaders and the Jewish community at large.
                </div>
                <div className="mb-8">
                    5. To counter anti-Semitism worldwide and support Israel's divine, God-given right to exist in her Godgiven land.
                </div>
                <div className="text-2xl m-5 font-serif italic text-center">BASIC VOLUNTEER REQUIREMENTS</div>
                <div className="mb-3 text-left text-xl md:text-2xl">WHO IS A BFP VOLUNTEER?</div>
                <div className="m-3">
                    The prophets of Israel knew that one day Gentile people would come to the land of Israel and help in its restoration. The prophet
                    Isaiah mentions these Gentiles on several occasions. He refers to them as "servants" in Isaiah 56:6. They are called "servants and
                    handmaids" in Isaiah 14:2. And in Isaiah 61:5, we read, "Strangers shall stand and feed your flocks, and the sons of the foreigner
                    shall be your plowmen and your vinedressers."
                </div>
                <div className="m-3">
                    We can see from Scripture that Gentiles do not come to Israel in a high and mighty position, but rather in the position of a
                    servant. Their position is much like that of Ruth of old. She was willing to abase herself to a position lower than that of a
                    servant girl (Ruth 2:13). As a result, God highly exalted her to be the great-grandmother of King David.
                </div>
                <div className="m-3 mb-8">
                    There are great numbers of Christians from foreign lands in Israel today who have come here in meekness and humility to serve the
                    Jewish people on behalf of God. In general, the work of volunteers is often the work that others do not wish to do. It is
                    demanding and requires much patience and love. But in the end, it is also greatly rewarding.
                </div>
            </section>
            <section className="mb-10 text-justify">
                <div className="text-2xl m-5 font-serif italic text-center">A VOLUNTEER WITH BRIDGES FOR PEACE IS REQUIRED TO:</div>
                <div className="m-3">1. Have a servant's heart. </div>
                <div className="m-3">2. Be a committed Christian.</div>
                <div className="m-3">3. Be at least 18 years of age.</div>
                <div className="m-3">4. Be in good health.</div>
                <div className="m-3">5. Be able to speak English.</div>
                <div className="m-3">6. Have the recommendations of your family, pastor and others in the community.</div>
                <div className="m-3">
                    7. Have the funds available to cover your food, lodging and other monthly expenses, as well as round trip airfare to and from
                    Israel.
                </div>
                <div className="m-3">
                    8. Have medical insurance that is valid outside your country in case of accident, injury or illness in Israel. (If necessary, BFP
                    can assist you to purchase a health insurance policy. Additional information is available upon request).
                </div>
                <div className="m-3">
                    9. Understand that during your term of service with BFP, you are not coming on a tour or a vacation, but you are coming to serve
                    in a volunteer position that is vital to the organization.
                </div>
                <div className="m-3">
                    10. Understand that the Israeli public perceives you as an ambassador for Jesus Christ and a representative of BFP. The future of
                    our work in Israel depends largely upon this display of Christian character and faithfulness.
                </div>
                <div className="m-3">11. Live and work in an environment where conditions are diverse due to language and cultural differences.</div>
                <div className="m-3">12. Understand that luxuries found at "home" may be absent.</div>
            </section>
            <section className="mb-5 bg-gray-100/10 shadow-lg p-4 md:p-8 rounded-lg ">
                {props.type == 'Zealous' ? (
                    <>
                        <div className="mb-3">
                            <span className="font-bold text-xl">Thank you</span> for completing your application for the Zealous Israel Project. We
                            truly appreciate the desire God has placed in your heart to serve and comfort His people while being intentionally
                            discipled as well.
                        </div>
                        <div className="mb-3">
                            <span className="font-bold text-xl">The application deadline is March 31, 2025.</span> After this date the applications
                            will be reviewed and notification about whether or not you are accepted will be sent in May.
                        </div>
                        <div className="mb-3">
                            Remember you can find more details about the timing and process on the{' '}
                            <Link className="text-blue-500 underline" href="https://www.bridgesforpeace.com/zealous82/zproject_z82">
                                apply page of the website.
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mb-3">
                            <span className="font-bold font-sans text-xl">Thank you</span> for considering BFP as a place to volunteer your time and
                            service in the land of Israel. We truly appreciate the desire God has placed in your heart to serve and to give comfort to
                            His people.
                        </div>
                        <div className="mb-3">
                            <span className="font-bold text-xl">The application process</span> usually takes between two to three months, from the
                            time the application documents are submitted to receiving a definitive answer from the Jerusalem office.
                        </div>
                        <div className="mb-8">
                            Several factors affect the processing time, including length of service time requested, availability of positions and when
                            references are received.
                        </div>
                    </>
                )}

                {props.type == 'Short Term' || (
                    <div className="mb-3">
                        <span className="font-bold text-xl">Please note:</span> All applicants who are applying to serve for over three months are
                        required to submit a Criminal Record Check/Police Clearance Certificate (
                        <Link className="underline text-blue-500" href={'/apply/contact-us'}>
                            Contact Us
                        </Link>{' '}
                        for assitance). The Criminal Record Check must be done at the Federal Level.
                    </div>
                )}
            </section>
        </div>
    );
};

export const DoctrinalStatement = () => {
    const statementTitleStyle = 'mb-3 text-xl md:text-2xl';
    const textStyle = 'm-3 mb-8';
    const italicVerse = (verse: string) => <span className="italic">{verse}</span>;
    return (
        <div className="p-4 md:text-lg">
            <div className="text-2xl md:text-3xl m-1 font-serif text-center">BRIDGES FOR PEACE</div>
            <div className="text-xl md:text-2xl m-5 font-serif italic text-center">DOCTRINAL STATEMENT</div>
            <div className={statementTitleStyle}>THE BIBLE</div>
            <ul className="m-3 mb-8 list-disc">
                <li>The Bible is the inspired Word of God {italicVerse('(2 Tim. 3:16)')}</li>
            </ul>
            <div className={statementTitleStyle}>GOD</div>
            <ul className="m-3 mb-8 list-disc">
                <li className="mb-2">God is one {italicVerse('(Deut. 6:4; 1 Cor. 8:6)')}</li>
                <li className="mb-2">The Father, Son and Holy Spirit exist in unity {italicVerse('(Matt. 28:19)')}</li>
                <li className="mb-2">Jesus the Messiah is God's only begotten Son {italicVerse('(Matt. 16:16; John 3:16)')}</li>
                <li className="mb-2">Jesus the Messiah is the only Mediator between God and man {italicVerse('(1 Tim. 2:5)')}</li>
                <li className="mb-2">Jesus the Messiah is eternal and fully God and fully man {italicVerse('(John 8:58; John 14:9; John 10:30)')}</li>
            </ul>
            <div className={statementTitleStyle}>MAN</div>
            <ul className="m-3 mb-8 list-disc">
                <li className="mb-2">All men have sinned and come short of the glory of God {italicVerse('(Rom. 3:23)')}</li>
                <li className="mb-2">
                    The wages of sin is death, but the gift of God is eternal life through Jesus the Messiah our Lord{' '}
                    {italicVerse('(Rom. 6:23; John 3:16,36)')}
                </li>
            </ul>
            <div className={statementTitleStyle}>SALVATION</div>
            <ul className="m-3 mb-8 list-disc">
                <li className="mb-2">Salvation is by grace through faith as a gift of God {italicVerse('(Eph. 2:8)')}</li>
                <li className="mb-2">
                    Repentance and baptism in the name of the Father, Son and Holy Spirit are outward signs of an inward faith{' '}
                    {italicVerse('(Eph.4:4,5)')}
                </li>
                <li className="mb-2">Faith is exhibited by a consecrated and holy life; faith without works is dead {italicVerse('(James 2:18)')}</li>
            </ul>
            <div className={statementTitleStyle}>ISRAEL</div>
            <ul className="m-3 mb-8 list-disc">
                <li className="mb-2">The nation of Israel is the apple of God's eye {italicVerse('(Zech. 2:8)')}</li>
                <li className="mb-2">God will not break His covenant with Israel {italicVerse('(Jer. 31:35–37)')}</li>
                <li className="mb-2">God is restoring the Jewish people to Israel, their Promised Land {italicVerse('(Jer. 23:7–8)')}</li>
                <li className="mb-2">Believers from Gentile backgrounds have a debt to the Jewish people {italicVerse('(Rom. 11)')}</li>
                <li className="mb-2">
                    God blesses those who bless Israel and curses those who curse Israel {italicVerse('(Gen. 12:3; Isa. 60:12)')}
                </li>
                <li className="mb-2">Blessing is promised to those who pray for Jerusalem's peace {italicVerse('(Ps. 122:6)')}</li>
            </ul>
            <div className={statementTitleStyle}>THE FUTURE</div>
            <ul className="m-3 mb-8 list-disc">
                <li className="mb-2">The bodily return of Jesus the Messiah is imminent {italicVerse('(Acts. 1:11)')}</li>
                <li className="mb-2">There will be a literal resurrection of the dead {italicVerse('(John 5:28)')}</li>
                <li className="mb-2">Those in the Messiah shall be immortalized {italicVerse('(1 Cor. 15:53–54)')}</li>
                <li className="mb-2">The wicked shall be placed in hell for eternity {italicVerse('(Rev. 20:10)')}</li>
                <li className="mb-2">Israel will be restored under the Kingship of Messiah Jesus {italicVerse('(Luke 1:32)')}</li>
                <li className="mb-2">All believers shall be joint heirs with the Messiah {italicVerse('(Rom. 8:17)')}</li>
            </ul>
        </div>
    );
};

export const EvangelismStatement = () => (
    <>
        <div className="text-xl md:text-2xl m-5 font-serif italic text-center">POSITION ON EVANGELISM</div>
        <div className="m-3 mb-8 text-justify">
            Bridges for Peace is a Bible-believing Christian organization, which does not proselytize. We are committed to being living witnesses of
            the love of God in the name of Jesus through unconditional friendship and support, in order that the wounds of the past may be healed and
            doors of communication can be opened between Christians and Jews.
        </div>
    </>
);
export const MessianicJudaismStatement = () => (
    <>
        <div className="text-xl md:text-2xl m-5 font-serif italic text-center">STATEMENT ON MESSIANIC JUDAISM</div>
        <div className="m-3 mb-8 text-left md:text-justify">
            <div className="mb-3">
                We affirm that Jewish believers in Jesus are members of the body of Messiah and recognize their authentic Jewish identity.
            </div>
            <div className="mb-3">
                God has given Bridges for Peace a specific mandate: building bridges between the broader Jewish community and the worldwide Christian
                Church. This specialized calling requires us to walk carefully between both communities as we work toward reconciliation and healing.
            </div>
            <div className="mb-3">
                While we honor our Messianic brothers and sisters, actively promoting Messianic Judaism would compromise our unique organizational
                calling. This boundary clarifies our calling without restricting personal worship choices or relationships.
            </div>
            <div className="mb-3">
                We remain committed to supporting all who love Israel and the Jewish people, recognizing that God has distributed different callings
                throughout His body. By faithfully stewarding our particular mandate, we contribute to His larger purposes of reconciliation and
                restoration.
            </div>
        </div>
    </>
);

export const WaiverNotice = () => (
    <div className="p-2">
        <div className="m-3 mb-8 text-justify">
            <p>
                In order to volunteer for Bridges for Peace in Israel, you will be required to sign a contractual waiver that has legal consequences.
                Please carefully read the words below and check the confirmation box at the bottom of this page to acknowledge your understanding.
            </p>
        </div>
        <div className="m-3 mb-8 text-justify">
            <div className="text-2xl md:text-3xl mt-16 m-6 font-serif text-center">Waiver Notice</div>
            <p>
                I am an adult over 18 years of age, and in consideration of my volunteering for the organization Bridges for Peace (hereinafter:
                “Bridges for Peace” or “the organization”) in Israel, I hereby freely agree to make the following contractual representations and
                agreements:
            </p>
            <ol className="list-decimal text-left ml-5 mt-5">
                <li className="mb-3">
                    I will read and understand the relevant Government Travel Advisory regarding the risks of travel to Israel and in any countries I
                    will be visiting during my period of volunteering in Israel.
                </li>
                <li className="mb-3">
                    I understand that Bridges for Peace cannot guarantee my safety during my period of volunteering in Israel and I assume full
                    responsibility for all risks associated with my travel to and volunteering in Israel.
                </li>
                <li className="mb-3">
                    I will voluntarily assume all the risks associated with such participation in the organization's volunteer programme and I declare
                    that I have not been forced, persuaded or coerced by any person to volunteer for the organization.
                </li>
                <li className="mb-3">
                    I agree that it is my sole responsibility to be familiar with the physical and/or mental demands associated with volunteering for
                    Bridges for Peace. With these demands in mind, I have no physical or mental condition which, to my knowledge, would endanger
                    myself or others if I volunteer. I further agree to abide by any established rules or regulations of the organization connected to
                    the period of volunteering.
                </li>
                <li className="mb-3">
                    I understand and expressly assume all the risks and dangers that may arise during my period of volunteering in Israel, and I
                    hereby release, waive, discharge, and covenant not to sue Bridges for Peace and/or their officers, directors, agents, servants,
                    and employees (collectively, the "Releasees") from all liability, claims, demands, actions, or causes of action whatsoever arising
                    out of any damages, loss, or injury to me or to my property while participating in the volunteer programme of the organization
                    whether such damage, loss, or injury, results from the negligence of the Releasees or for any other cause.
                </li>
                <li className="mb-3">
                    I also hereby release, waive, discharge and covenant not to sue the Releasees from any claims whatsoever on account of any first
                    aid, treatment, or service rendered to me during my participation in the above activity.
                </li>
                <li className="mb-3">
                    I agree, for myself and my successors, that the above representations and agreements are contractually binding and are not mere
                    recitals. I agree that this Agreement is intended to be as broad and inclusive as permitted by the laws of the country I am
                    resident in, and that if any portion of it is held invalid, the balance shall continue in full force and effect.
                </li>
                <li className="mb-3">
                    I have carefully read this form and fully understand its contents. I am aware that this is a release of liability, a waiver of
                    claims, an agreement not to sue, an indemnity, and a contract between myself and Bridges for Peace and I agree to it of my own
                    free will.
                </li>
                <li className="mb-3">
                    This agreement also discharges the Releasees from any liability and/or claim that any third party may have against the
                    organization with respect to any claim that any third party may have or bring against the Releasees which may result from my
                    participation in any activity or volunteer programme of the organization.
                </li>
                <li>
                    I agree that this Waiver is intended to be as broad and inclusive as permitted by the laws of the State of Israel, and that this
                    Waiver shall be solely governed by and interpreted in accordance with the laws of the State of Israel.
                </li>
            </ol>
        </div>
    </div>
);
