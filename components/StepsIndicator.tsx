import Icon from "./Icon"

interface Step {
  label: string
  description?: string
}

interface StepsIndicatorProps {
  steps: Step[]
  currentStep: number
  style?: string
}

export default function StepsIndicator({ steps, currentStep = 1, style = "w-full max-w-3xl mx-auto" }: StepsIndicatorProps = {
  steps: [
    { label: "Step 1", description: "Select items" },
    { label: "Step 2", description: "Enter details" },
    { label: "Step 3", description: "Confirm order" }
  ],
  currentStep: 1
}) {
  return (
    <div className={style}>
      <ol className="flex items-center">
        {steps.map((step, index) => (
          <li key={step.label} className="relative flex-1">
            {index > 0 && (
              <div
                className={`absolute top-5 left-0 -translate-x-1/2 w-full h-0.5 ${index < currentStep ? "bg-green-600" : "bg-muted"
                  }`}
              />
            )}
            <div className="flex flex-col items-center group">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${index + 1 < currentStep
                    ? "border-green-600 bg-green-600 text-primary-foreground"
                    : index + 1 === currentStep
                      ? "border-primary text-primary"
                      : "border-muted text-muted-foreground"
                  } transition-colors duration-300 ease-in-out group-hover:border-primary`}
              >
                {index + 1 < currentStep ? (
                  <Icon name="Check" className="w-6 h-6" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <div className={`text-sm font-medium ${index + 1 <= currentStep ? "text-primary" : "text-muted-foreground"
                  }`}>
                  {step.label}
                </div>
                {step.description && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}