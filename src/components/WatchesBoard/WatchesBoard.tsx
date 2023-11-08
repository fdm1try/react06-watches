import './WatchesBoard.css';
import { useState, useRef } from 'react';
import { Watches, IWatches } from '../Watches';

type TWatchesList = Array<IWatches>;

export const WatchesBoard : React.FC = () => {
  const [list, setList] = useState<TWatchesList>([]);
  const nameInput = useRef<HTMLInputElement>(null);
  const timezoneInput = useRef<HTMLInputElement>(null);
  // setInterval(() => setActive(!active), 10000)
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = nameInput.current?.value;
    const timezone = timezoneInput.current?.value;
    if (!name || !timezone) return;
    setList([...list, {name, timezone} ]);
  }

  const removeItem = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  }

  return (
    <div className='board'>
      <form onSubmit={handleSubmit} className='board-form'>
        <input ref={nameInput} name='name' className='board-form-name_input' type='text' required placeholder='название...' />
        <input ref={timezoneInput} name='timezone' required 
          className='board-form-timezone_input' pattern="(GMT|UTC)[\+\-]\d{1,2}(:\d{1,2})?" 
          type='text' placeholder='Москва: GMT+3, или Венесуэла UTC−4:30'
        />
        <button className='board-form-submit'>+</button>
      </form>
      <div className='board-list'>        
      {list.map((item, index) => (
        <div className='board-list-item'>
          <button className='board-item-close_button' onClick={() => removeItem(index)}>✖</button>
          <h3 className='board-item-title'>{item.name}</h3>
          <div className='board-item-container'>
            <Watches name={item.name} timezone={item.timezone} />
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}
