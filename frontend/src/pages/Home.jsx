import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Cloud, Shield, Upload, Share2, CreditCard, Lock, Zap, Users } from 'lucide-react'

const Home = () => {
  const { user } = useAuth()

  const features = [
    {
      icon: Shield,
      title: 'Secure Storage',
      description: 'Your files are protected with enterprise-grade security and JWT authentication'
    },
    {
      icon: Upload,
      title: 'Multi-file Upload',
      description: 'Upload multiple files simultaneously with drag-and-drop support'
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Generate public links to share files with anyone, no account required'
    },
    {
      icon: CreditCard,
      title: 'Credit System',
      description: 'Pay-as-you-go model with secure Razorpay payment integration'
    },
    {
      icon: Lock,
      title: 'Privacy Controls',
      description: 'Toggle file privacy between private and public with one click'
    },
    {
      icon: Zap,
      title: 'Fast & Reliable',
      description: 'Built on MinIO object storage for lightning-fast file operations'
    }
  ]

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center py-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Cloud className="h-20 w-20 text-primary-600 mx-auto mb-6 animate-bounce-gentle" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Share Files
            <span className="block text-primary-600">Securely & Simply</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            CloudShare is a secure file sharing platform with credit-based uploads, 
            JWT authentication, and instant public link generation. Share with anyone, anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link to="/dashboard" className="btn-primary text-lg px-8 py-4">
                  Go to Dashboard
                </Link>
                <Link to="/upload" className="btn-secondary text-lg px-8 py-4">
                  Upload Files
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg px-8 py-4">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to share files
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with modern technologies and security best practices to give you 
              peace of mind when sharing your important files.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-xl transition-shadow duration-300">
                <feature.icon className="h-12 w-12 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How CloudShare Works
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Simple, secure file sharing in three easy steps
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold">Upload Files</h3>
              <p className="text-gray-600">
                Create an account, buy credits, and upload your files with drag-and-drop ease.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold">Make Public</h3>
              <p className="text-gray-600">
                Toggle your files to public to generate shareable links instantly.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold">Share Anywhere</h3>
              <p className="text-gray-600">
                Send the link to anyone - no account required for downloads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="gradient-bg rounded-2xl p-12 text-white">
              <Users className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-4xl font-bold mb-4">
                Ready to start sharing?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of users who trust CloudShare for secure file sharing.
              </p>
              <Link to="/register" className="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-block">
                Create Free Account
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Cloud className="h-8 w-8" />
            <span className="text-2xl font-bold">CloudShare</span>
          </div>
          <p className="text-gray-400 mb-6">
            Secure file sharing platform with credit-based system
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>•</span>
            <a href="https://github.com/Surendra1341/CloudShare" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              GitHub
            </a>
            <span>•</span>
            <span>Made with ❤️ by Surendra</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home