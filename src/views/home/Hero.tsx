import { Svg as HeroImage } from '~/public/assets/images/student.svg'

/**
 * Hero section on home page.
 */
export function Hero(): JSX.Element {
  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <HeroImage className="h-56 text-primary-600" />
      <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl text-neutral-800">
        Looking for learning resources?
      </h1>
      <p className="text-xl font-medium text-neutral-500">
        DARIAH-CAMPUS is a discovery framework and hosting platform for DARIAH
        learning resources.
      </p>
    </div>
  )
}
