import Image from 'next/image';
import localFont from 'next/font/local';

const euroStyleBoldFont = localFont({ src: 'fonts/EurostileLTStd-Bold.otf', display: 'swap', weight: '200', style: 'normal' });
export default function Component() {
    return (
        <div className="bg-white min-h-screen text-black font-[afacad]">
            <div className="relative flex max-w-6xl mx-auto shadow-lg rounded-lg border-white">
                {/* <div className="absolute w-[95%] h-[95%] p-[5%] border-4 border-blue-200"></div> */}
                <div className="grid md:grid-cols-2 gap-0">
                    {/* Left Column */}
                    <div>
                        <div className={`border-white text-left`}>
                            <div className="items-center p-6 border-white bg-[rgb(25,25,21)] text-white">
                                <div className="max-w-[500px] flex flex-col justify-center items-center p-6 border-white bg-[rgb(25,25,21)] text-white">
                                    <div className="flex justify-center relative">
                                        <div className="font-[arid-itc] text-4xl flex items-center italic -left-20 w-fit absolute">the </div>
                                        <div style={{ transform: 'scale(1.4,1)' }} className={`${euroStyleBoldFont.className} text-4xl w-fit`}>
                                            ZEALOUS
                                        </div>
                                    </div>
                                    <h2 className="font-[arid-itc] text-4xl text-end self-end font-script italic w-96 max-w-[280px]">
                                        Israel Project
                                    </h2>
                                    <h3 className={`${euroStyleBoldFont.className} text-red-500 text-xl`}>Financial Obligation Policy</h3>
                                </div>
                            </div>
                            <section className="flex flex-wrap p-8 ">
                                <p className="text-md mb-4">
                                    Please read this document carefully to ensure you understand your financial commitment. Choose your preferred
                                    payment option and click <span className=" font-bold">Save & Submit</span> at the bottom.
                                </p>

                                <p className="text-md mb-4">
                                    The total cost of the Zealous Israel Project beginning July 20, 2025 and ending June 18, 2026 is US{' '}
                                    <span className="font-bold">$7,995</span>. Some portion of this amount is due by{' '}
                                    <span className="font-bold">June 20, 2025, depending on the payment option chosen.</span>
                                </p>

                                <p className="text-md underline mb-4">
                                    All payments and monthly support monies must be given or sent directly to your national office. These arrangements
                                    will be made upon your acceptance to the program and can be done through debit/credit card.
                                </p>

                                <div className="mb-4">
                                    <h4 className={`font-sans text-xl text-red-500 font-bold mb-2`}>Price Includes:</h4>
                                    <ul className="text-md space-y-1 list-disc list-inside">
                                        <li>One-year furnished housing in gender-separate, shared accommodations (two or three people per room).</li>
                                        <li>
                                            A food allowance to shop for groceries and prepare meals together. The food allowance will be for three
                                            meals per day.
                                        </li>
                                        <li>A public transportation pass for travel in Jerusalem.</li>
                                        <li>All expenses for program-related events, activities, studies and travel.</li>
                                        <li>
                                            The Call to Zion tour, a twelve-day Israel experience for young adults. This includes accommodations, most
                                            meals and travel in Israel.
                                        </li>
                                        <li>
                                            The Bridges for Peace Institute of Israel Studies, a two-week training seminar in 2026, featuring key
                                            speakers from both the Jewish and Christian worlds.
                                        </li>
                                    </ul>
                                </div>

                                <div className="mb-4">
                                    <h4 className={`font-sans text-xl text-red-500 font-bold mb-2`}>Not Included:</h4>
                                    <ul className="list-disc list-inside text-md space-y-1">
                                        <li>Airfare to and from Israel</li>
                                        <li>Spending money for personal items</li>
                                        <li>Three lunches during the 12-day tour (about US $60 total)</li>
                                        <li>Visa fees before beginning the program</li>
                                        <li>Medical insurance (required)</li>
                                    </ul>
                                </div>

                                <div className="mb-4">
                                    <h4 className={`text-xl font-sans text-red-500 font-bold mb-2`}>Refunds:</h4>
                                    <p className="text-md">
                                        The cost for your participation in the ZProject has been evaluated and set to provide a quality experience.
                                        The initial overhead and expenditures for the program are incurred in the beginning phase of the project.
                                        Please note that refunds are given only due to personal hardship and in approved circumstances. Bridges for
                                        Peace will retain the US $500 nonrefundable deposit in all cases, except for those involving extreme
                                        circumstances (for instance, cancellation of the ZProject due to COVID-19 or inability to enter the country
                                        due to short-notice travel restrictions). Please note that the Israeli government may impose restrictions on
                                        travel, entry into Israel or general activities at any time before or during your participation that could
                                        affect the program and your time with the ZProject. Neither Bridges for Peace nor Zealous can be held
                                        accountable for the changing restrictions, but please be assured that we will do our best to ensure the
                                        success of the program under all circumstances. In case you are unable to enter Israel due to short-notice
                                        travel restrictions, you will receive a refund for your tuition.{' '}
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className="text-left bg-red-50">
                        <Image
                            src="/images/zealous-image4.jpg"
                            alt="Group photo of Zealous Israel Project participants"
                            width={1000}
                            height={1000}
                            className="w-full h-auto mb-6"
                        />

                        <div className="mb-4 px-6">
                            <h4 className={`text-xl font-sans text-red-500 font-bold mb-2`}>Payment Options</h4>
                            <p className="text-md pb-4 border-b-2 border-red-200">
                                Please select the payment option that works best for you and initial in the relevant box. All payment options will be
                                arranged through your national office and will be finalized before arrival to Israel. All prices are shown in US
                                dollars.
                            </p>
                        </div>

                        <div className="space-y-4 px-6">
                            <div className=" border-b-2 border-red-200 p-4 rounded">
                                <h5 className={`font-bold text-2xl mb-4`}>Option 1</h5>
                                <p className="text-md">
                                    US $500 nonrefundable deposit due immediately upon acceptance. This is used to secure your place in the housing
                                    facilities.
                                </p>
                                <p className="text-md font-bold mt-4">US $7,495 due June 20, 2025</p>
                            </div>

                            <div className=" border-b-2 border-red-200 p-4 rounded">
                                <h5 className="font-bold text-2xl mb-4">Option 2</h5>
                                <p className="text-md">
                                    US $500 nonrefundable deposit due immediately upon acceptance. This is used to secure your place in the housing
                                    facilities.
                                </p>
                                <p className="text-md font-bold my-5">US $4,000 due June 20, 2025</p>
                                <p className="text-md">
                                    <span className="text-md font-bold">Seven</span> US $500 monthly payments. This program requires{' '}
                                    <span className="text-md font-bold">automatic withdrawal</span> from a checking debit or credit card account. This
                                    must be set up through your national office.
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-md">
                                    <p>US $500 due Aug. 1, 2025</p>
                                    <p>US $500 due Nov. 1, 2025</p>
                                    <p>US $500 due Sept. 1, 2025</p>
                                    <p>US $500 due Dec. 1, 2025</p>
                                    <p>US $500 due Oct. 1, 2025</p>
                                    <p>US $500 due Jan. 1, 2026</p>
                                </div>
                                <p className="flex justify-center w-full mt-2">US $495 due Feb. 1, 2026</p>
                            </div>

                            <div className="p-4 rounded">
                                <h5 className="font-bold text-2xl mb-4">Option 3</h5>
                                <p className="text-md">
                                    US $500 nonrefundable deposit due immediately upon acceptance. This is used to secure your place in the housing
                                    facilities.
                                </p>
                                <p className="text-md font-bold my-5">US $3.995 due June 20, 2025</p>
                                <p className="text-md">
                                    <span className="text-md font-bold">Ten</span> US $350 monthly payments. This program requires{' '}
                                    <span className="text-md font-bold">automatic withdrawal</span> from a checking debit or credit card account. This
                                    must be set up through your national office.
                                </p>
                                <div className="grid grid-cols-2 gap-2 text-md">
                                    <p>US $350 due Aug. 1, 2025</p>
                                    <p>US $350 due Jan. 1, 2026</p>
                                    <p>US $350 due Sept. 1, 2025</p>
                                    <p>US $350 due Feb. 1, 2026</p>
                                    <p>US $350 due Oct. 1, 2025</p>
                                    <p>US $350 due Mar. 1, 2026</p>
                                    <p>US $350 due Nov. 1, 2025</p>
                                    <p>US $350 due Apr. 1, 2026</p>
                                    <p>US $350 due Dec. 1, 2025</p>
                                    <p>US $350 due May 1, 2026</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center mt-6 w-full bg-[rgb(25,25,21)]">
                            <span className="text-white flex justify-center items-center">www.zealous82.com</span>
                            <Image
                                src="/images/zealous-82.jpg"
                                alt="Zealous 82 Logo"
                                width={350}
                                height={100}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 10vw"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
