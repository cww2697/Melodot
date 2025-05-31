import React from "react";
import {Option} from "@/app/components/form/SingleSelect";

interface WarningBannerProps {
    text: string;
}

const WarningBanner: React.FC<WarningBannerProps> = ({text,})=> {
    return (
        <div className="pb-6">
            <div
                className="flex items-center bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded"
                role="alert"
            >
                <div className="mr-4">
                    <svg
                        className="w-6 h-6 mr-2 text-yellow-700 flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <div>
                    {text}
                </div>
            </div>
        </div>
    );
};

export default WarningBanner;
