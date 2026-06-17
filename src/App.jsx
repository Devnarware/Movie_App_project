import Card from './components/Card.jsx'

const App = () => {
  return (
    <div
      className='bg-[#07070cf4] h-screen p-10'>
      <div className='flex flex-col items-center gap-5'>
        <Card name="IronMan" />
        <Card name="Spiderman" />
        <Card name="Thor" />
      </div>
    </div>
  )
}

export default App