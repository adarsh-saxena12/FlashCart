"use server"

import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice } from '../utils';

export async function scrapeAmazonProduct(url: string) {

    if(!url) return;

    //BrightData proxy configuration
    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port  = 22225;
    const session_id = (1000000 * Math.random()) | 0;

    const options = {
        auth: {
            username: `${username}-session-${session_id}`,
            password,
        },
        host: 'brd.superproxy.io',
        port,
        rejectUnauthorized: false,
    }

    try {
        //fetch product page

        const response = await axios(url, options);
        
        const $ = cheerio.load(response.data)

    //Extract product info
    const title = $('#productTitle').text().trim();
        

    const currentPrice = extractPrice(
        $('.priceToPay span.a-price-whole'),
        $('a.size.base.a-color-price'),
        $('.a-button-selected .a-color-base')
    );    
       
    const originalPrice = extractPrice(
        $('#priceblock_ourprice'),
        $('.a-price.a-text-price span.a-offscreen'),
        $('#listPrice'),
        $('#priceblock_dealprice'),
        $('.a-size-base.a-color-price')

    )

    const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';

    const image = 
    $('#imageBlkFront').attr('data-a-dynamic-image') || 
    $('#landingImage').attr('data-a-dynamic-image') || '{}';

    const imageUrls = Object.keys(JSON.parse(image)); 

    const currency = extractCurrency($('.a-price-symbol'))
    const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");

    const description = extractDescription($);

    const brandname = $('.a-size-base.po-break-word').text().trim().slice(0, 4);
    
    const modelname = $('.a-size-base.po-break-word').text().trim().slice(4, 15);

    const color = $('.a-size-base.po-break-word').text().trim().slice(15, 23);

    const stars = $('.a-icon-alt').first().text().trim();


    // data object with scraped information
    const data = {
        url,
        currency,
        image: imageUrls[0],
        title:title,
        currentPrice: Number(currentPrice) || Number(originalPrice),
        originalPrice: Number(originalPrice) || Number(currentPrice),
        priceHistory: [],
        discountRate: Number(discountRate),
        category: 'category',
        reviewsCount: 100,
        brandname:brandname,
        stars: stars,
        isOutOfStock: outOfStock, 
        description:description,
        lowestPrice: Number(currentPrice) || Number(originalPrice),
        highestPrice: Number(originalPrice) || Number(currentPrice),
        averagePrice: Number(currentPrice) || Number(originalPrice),
    }

    console.log({data});
    return data;
      
    } catch (error: any) {
        throw new Error(`Failed to scrape product: ${error.message}`)
    }

}
