# Prayer-Timer

This React component, MainContent, serves as the main content area for a prayer time application. It includes functionality to display prayer times for different cities, dynamically changing background images based on the selected city, and updating the remaining time until the next prayer dynamically.

Key features:

Display of prayer times for five daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) for a selected city.
Automatic update of prayer times based on the selected city using data fetched from the Aladhan API.
Dynamic calculation of the remaining time until the next prayer, updating every second.
Background image changes based on the selected city, providing a visual representation of the location.
User interface elements for selecting a city from a predefined list, enabling users to switch between different locations easily.
This component integrates various UI components from the Material-UI library, including Grid, Divider, Stack, Select, MenuItem, and FormControl, to create a visually appealing and functional interface. Additionally, it utilizes asynchronous data fetching with axios, moment-timezone for timezone handling, and useState and useEffect hooks for managing state and lifecycle events, respectively.
## You can try it on netlify : 
 ### https://66387afa8807c08733abd995--reliable-selkie-d5c3ce.netlify.app/
