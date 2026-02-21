# 🎬 FleetFlow Hackathon Video Script

**Target Length:** ~6 Minutes
**Objective:** Focus on the user experience and the value of your application. No need to show code.

---

## Scene 1: Introduction (0:00 - 0:45)
**Visual Plan:** Start on the Login page or the Dashboard. Move your mouse smoothly, no rapid clicking yet. Let the glassmorphism UI shine.

**Voiceover:** 
> "Hello everyone, and welcome to our demonstration of **FleetFlow**. We built FleetFlow to solve a major problem in modern logistics: disconnected systems. Too often, managers have to use one tool to track their vehicles, a completely different spreadsheet for their drivers, and yet another app for logging fuel and maintenance. 
>
> We’ve consolidated all of that into a single, beautiful, cohesive Command Center. FleetFlow is designed to be a complete, end-to-end Enterprise Resource Planning tool for mid-market logistics companies, making operations seamless and efficient."

---

## Scene 2: The Command Center (0:45 - 1:30)
**Visual Plan:** Click on 'Command Center' in the sidebar. Hover over the KPI cards to show the subtle shadow/lift animations. Point out the numbers.

**Voiceover:** 
> "We are currently looking at the Command Center dashboard. This is the manager's real-time overview of fleet operations. It instantly pulls real-time data from our backend to calculate crucial KPIs: how many vehicles are currently active, how many are down in the shop, our overall fleet utilization rate, and how much pending cargo needs to be shipped. It’s designed using a premium glass aesthetic that feels modern and incredibly responsive."

---

## Scene 3: Personnel and Asset Registries (1:30 - 3:00)
**Visual Plan:** Click on 'Vehicles' in the sidebar. Scroll through the table. Click the dropdown to change a vehicle's status to `IN_SHOP`. Highlight the green success toast notification popping up in the corner. Then click on 'Drivers' in the sidebar and do the same.

**Voiceover:** 
> "Let’s look at how we manage our assets. On the **Vehicle Registry** page, we can track every truck, van, and bike in our fleet. We track their capacity in kilograms, their current odometer readings, and their live status. Notice how if we change a vehicle's status to 'In Shop', we get a beautiful, animated Toast notification confirming the update in real-time.
>
> Over on the **Drivers** tab, we manage our most important resource: our personnel. For every driver, we track the class of license they hold—so a driver only licensed for bikes can't be assigned a heavy truck—as well as their safety scores and license expiration dates. This ensures compliance is baked directly into the platform."

---

## Scene 4: The Dispatch Workflow & Smart Match (3:00 - 4:45)
**Visual Plan:** This is the wow-factor! Go to the 'Dispatch' page. Click 'Create Dispatch'. Slowly type a weight like '1200' into the Cargo Weight field. Click the **Smart Match Assets** button. Show the Toast notification finding the match. Then click 'Dispatch Trip' to submit it.

**Voiceover:** 
> "Now I want to show you the defining feature of FleetFlow: The Dispatch Workflow. Let’s say a client needs to move 1,200 kilograms of cargo. 
>
> Traditionally, a dispatcher would have to cross-reference multiple lists to find a vehicle big enough, and then find a driver with the right license. Instead, we built the **Smart Match** algorithm explicitly to automate this. 
>
> I just enter '1200' kilograms and click the 'Smart Match Assets' button. Instantly, our algorithm scans the available fleet and finds the *smallest* capable vehicle—to save on fuel and overhead—and then automatically pairs it with the *safest* available driver who holds the correct license type for that specific vehicle. It’s a perfect, automated pairing.
>
> When we hit 'Dispatch Trip', a secure SQLite transaction updates the status of the Trip, the Vehicle, and the Driver simultaneously to 'ON_TRIP'. Nothing falls through the cracks."

---

## Scene 5: Maintenance & Logs (4:45 - 5:30)
**Visual Plan:** Navigate to ‘Maintenance & Logs’. Click 'Add Log Record'. Select 'Fuel', pick a vehicle, type '15' liters, and set a cost in Rupees. Submit it.

**Voiceover:** 
> "To keep a fleet profitable, you have to track running costs. Under **Maintenance & Logs**, dispatchers and drivers can record fuel fill-ups or mechanical repairs. If a vehicle needs an oil change, we can log the exact cost in Rupees and track the amount of fuel consumed. This data doesn't just sit in a vacuum; it feeds directly into our overarching financial engine."

---

## Scene 6: Financial Analytics (5:30 - 6:30)
**Visual Plan:** Click on the 'Analytics' tab. Slowly scroll down to show the KPI cards at the top, the Bar Chart in the middle, and finally the Financial Summary table at the bottom.

**Voiceover:** 
> "Finally, we bring it all together on the **Operational Analytics** page. 
>
> Our backend aggregates all dispatched trips, fuel consumption logs, and maintenance records to give business owners true visibility. We calculate the Fleet's Fuel Efficiency in kilometers per liter, aggregate Total Revenue from completed trips, and deduct Operating Costs. 
>
> We can even see the strict Return on Investment per vehicle visually charted out, alongside a detailed monthly tabular breakdown in Rupees. 
>
> By combining automated intelligent dispatching with real-time financial tracking, FleetFlow isn't just a database; it’s an active partner in scaling a logistics business. 
>
> Thank you for your time and for checking out FleetFlow!"

---

## 💡 Tips for Recording
1. **Do a dry run:** Practice clicking through the app while reading the script a couple of times so your mouse movements match the words.
2. **Smile while you speak:** It sounds strange, but people can hear a smile. It makes the voiceover much more engaging!
3. **Hide your bookmarks/menu bar:** Press `F11` (or click View > Enter Full Screen) in your browser before you start recording so the UI looks as clean and professional as an installed desktop app.
