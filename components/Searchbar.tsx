"use client"

import { scrapeAndStoreProduct } from "@/lib/actions";
import { FormEvent, useState } from "react";

const isvalidAmazonProductUrl = (url: string) => {
      try {
        const parseURL = new URL(url);
        const hostname = parseURL.hostname;

        if(
            hostname.includes('amazon.com') || hostname.includes('amazon.') || hostname.endsWith('amazon')
        ) {
            return true;
        }
      }catch (error) { 
        return false;
      }

      return false;
}

const Searchbar = () => {

    const [searchPrompt, setSearchPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = 
   async (e: FormEvent<HTMLFormElement>) => {

        //prevents reload after submit
        e.preventDefault();
        
        const isValidLink = isvalidAmazonProductUrl(searchPrompt);
        
        if(!isValidLink) {

        return alert("please provide a valid amazon product link!");

        }

        try {
        setIsLoading(true);

        // Scrap the product page

        const product = await scrapeAndStoreProduct(searchPrompt);

        // console.log(product);
        

        } catch (error) {
            console.log(error);
            
        } finally {
            setIsLoading(false);
        }

    }
    return (
        <form 
        className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>

           <input 
            type="text"
            value={searchPrompt}
            autoFocus
            onChange={(e) => setSearchPrompt(e.target.value)}
            placeholder="Enter Product Link"
            className="searchbar-input"
           />

           <button 
           type="submit"
           className="searchbar-btn"
           disabled={searchPrompt === ''}
           >
           {isLoading ? 'Searching...' : 'Search'}
           </button>
        </form>
    );
};

export default Searchbar;