import Button from './Button'

type FooterProps = {
  onNext: () => void
  onBack: () => void;
  backDisabled?: boolean;
  nextDisabled?: boolean;
  showBack?: boolean;
}

export function Footer(props: FooterProps) {
  return (
    <div className='bg-emerald-500 absolute bottom-0 p-5 w-full flex flex-col-reverse gap-2 md:flex-row justify-between text-white'>
      <Button disabled={props.backDisabled} type='button' hidden={props.showBack} label='Back' onClick={props.onBack}  />
      <Button disabled={props.nextDisabled} type='button' label='Next' onClick={props.onNext} />
    </div>
  )
}
