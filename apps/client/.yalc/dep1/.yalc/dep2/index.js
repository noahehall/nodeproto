
export default function intervalLog = () => {
    setInterval(() => console.log('dep2: ' + new Date(), 3000))
}