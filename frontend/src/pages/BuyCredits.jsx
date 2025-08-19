import { useState } from 'react'
import { paymentAPI } from '../services/api'
import { CreditCard, Check, Zap, Star, Crown } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'

const BuyCredits = () => {
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  const creditPlans = [
    {
      id: 'basic',
      name: 'Basic Pack',
      credits: 10,
      price: 99,
      originalPrice: 120,
      icon: CreditCard,
      color: 'blue',
      popular: false,
      features: ['10 File Uploads', 'Email Support', '30 Days Validity']
    },
    {
      id: 'pro',
      name: 'Pro Pack',
      credits: 50,
      price: 399,
      originalPrice: 500,
      icon: Zap,
      color: 'green',
      popular: true,
      features: ['50 File Uploads', 'Priority Support', '90 Days Validity', 'Best Value']
    },
    {
      id: 'premium',
      name: 'Premium Pack',
      credits: 100,
      price: 699,
      originalPrice: 900,
      icon: Crown,
      color: 'purple',
      popular: false,
      features: ['100 File Uploads', '24/7 Support', '180 Days Validity', 'Maximum Storage']
    }
  ]

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async (plan) => {
    setSelectedPlan(plan.id)
    setLoading(true)

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpay()
      if (!scriptLoaded) {
        toast.error('Payment gateway failed to load. Please try again.')
        return
      }

      // Create order
      const orderResponse = await paymentAPI.createOrder(plan.price)
      const order = orderResponse.data

      // Razorpay options
      const options = {
        key: 'rzp_test_your_key_here', // Replace with your Razorpay key
        amount: order.amount,
        currency: order.currency,
        name: 'CloudShare',
        description: `Purchase ${plan.credits} credits`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify payment
            await paymentAPI.verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            })
            
            toast.success(`Successfully purchased ${plan.credits} credits!`)
            // You might want to refresh user credits here
          } catch (error) {
            toast.error('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com'
        },
        theme: {
          color: '#2563eb'
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            setSelectedPlan(null)
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      toast.error('Failed to initiate payment. Please try again.')
    } finally {
      setLoading(false)
      setSelectedPlan(null)
    }
  }

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700'
      }
    }
    return colors[color]
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Buy Credits</h1>
        <p className="text-xl text-gray-600">
          Choose a plan that fits your file sharing needs
        </p>
      </div>

      {/* Credit Plans */}
      <div className="grid md:grid-cols-3 gap-8">
        {creditPlans.map((plan) => {
          const colors = getColorClasses(plan.color)
          return (
            <div
              key={plan.id}
              className={`relative card ${colors.bg} ${colors.border} hover:shadow-xl transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="h-3 w-3" />
                    <span>Most Popular</span>
                  </span>
                </div>
              )}

              <div className="text-center">
                <plan.icon className={`h-12 w-12 ${colors.text} mx-auto mb-4`} />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
                  {plan.originalPrice && (
                    <span className="text-lg text-gray-500 line-through ml-2">₹{plan.originalPrice}</span>
                  )}
                </div>
                <p className={`text-lg font-semibold ${colors.text} mb-6`}>
                  {plan.credits} Upload Credits
                </p>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePayment(plan)}
                  disabled={loading && selectedPlan === plan.id}
                  className={`w-full text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${colors.button}`}
                >
                  {loading && selectedPlan === plan.id ? (
                    <LoadingSpinner size="small" text="Processing..." />
                  ) : (
                    `Buy ${plan.credits} Credits`
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Payment Info */}
      <div className="card bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <h4 className="font-medium mb-2">Secure Payment</h4>
            <p>All payments are processed securely through Razorpay with bank-level encryption.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Credit Usage</h4>
            <p>Each file upload consumes 1 credit. Credits don't expire and can be used anytime.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Refund Policy</h4>
            <p>Credits are non-refundable. Please choose your plan carefully before purchasing.</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Customer Support</h4>
            <p>Need help? Contact our support team for assistance with your purchases.</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="card">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">How do credits work?</h4>
            <p className="text-gray-600">Each file upload requires 1 credit. You can upload files of any size (up to 100MB) and type.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Do credits expire?</h4>
            <p className="text-gray-600">No, your credits never expire. You can use them whenever you need to upload files.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Can I share files for free?</h4>
            <p className="text-gray-600">Yes! Once uploaded, you can make files public and share them with anyone for free.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
            <p className="text-gray-600">We accept all major credit cards, debit cards, net banking, and UPI through Razorpay.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyCredits