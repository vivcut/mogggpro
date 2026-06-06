"use client";

import { ArticleIcon, Tag } from "@phosphor-icons/react";
import { ChatsTeardropIcon, CurrencyEthIcon, PersonArmsSpreadIcon, SmileyWinkIcon } from "@phosphor-icons/react/dist/ssr";

export default function Page() {
    const navLinks = [
        { 
            href: "/dashboard/rizz", 
            icon: <ChatsTeardropIcon weight="fill" size={24} />, 
            label: "Rizz Practice", 
            description: "Practice your conversation skills with AI-powered chat simulations" 
        },
        { 
            href: "/dashboard/face", 
            icon: <SmileyWinkIcon weight="fill" size={24} />, 
            label: "Face Analysis", 
            description: "Get insights about your facial features and attractiveness" 
        },
        { 
            href: "/dashboard/height", 
            icon: <PersonArmsSpreadIcon weight="fill" size={24} />, 
            label: "Height Coach", 
            description: "Estimate and maximize to improve your posture and appearance" 
        },
       
        { 
            href: "#", 
            icon: <CurrencyEthIcon weight="fill" size={24} />, 
            label: "My Subscription", 
            description: "Manage your subscription plan and payment details" 
        },
        { 
            href: "https://docs.google.com/forms/d/e/1FAIpQLSeZ4WmzyUtVd72xOZiFdDMRIEAwnKcFKA4J_heIjhPuBEkXqw/viewform?usp=dialog", 
            icon: <Tag weight="fill" size={24} />, 
            label: "Feature request", 
            description: "Request a feature to be built" 
        },
        
    ];
    
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-[500]">Home</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6 gap-4">
                {navLinks.map((link, index) => (
                    <a
                        key={index}
                        href={link.href}
                        className="group block p-6 bg-[#171719] rounded-3xl border border-border hover:border-blue-500 hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex items-center space-x-4 mb-3">
                            <div className="p-2 bg-muted rounded-lg transition-colors duration-200">
                                {link.icon}
                            </div>
                            <h2 className="text-xl font-medium text-white">{link.label}</h2>
                        </div>
                        <p className="text-gray-600 text-sm">{link.description}</p>
                        <div className="mt-4 text-muted-foreground text-sm font-medium group-hover:text-white transition-colors duration-200">
                            Get started →
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}