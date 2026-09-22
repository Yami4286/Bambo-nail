import { motion } from 'framer-motion'
import { services, serviceCategories } from '../data/services'
import { useListVariants } from './Motion'
import ServiceCard from './ServiceCard'
import SectionHeading from './SectionHeading'

const categoryHeading = {
  Manicures: ['The classic,', 'reconsidered.'],
  'Nail Enhancement': ['Strength,', 'beautifully built.'],
  'Nail Art': ['A little', 'artistry.'],
}

/**
 * Reusable service grid. Featured mode shows the first four services;
 * full mode shows the complete catalogue grouped by category.
 */
export default function ServiceList({ featured = false }) {
  const { list, item } = useListVariants()

  if (featured) {
    const featuredServices = services.slice(0, 4)
    return (
      <motion.div className="service-grid" variants={list} initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.12 }}>
        {featuredServices.map(service => <ServiceCard key={service.slug} service={service} />)}
      </motion.div>
    )
  }

  return (
    <div className="services-catalogue">
      {serviceCategories.map(category => (
        <section className="services-catalogue__group" key={category} aria-labelledby={`category-${category.replace(/\s+/g, '-')}`}>
          <SectionHeading
            label={category}
            title={
              <>
                {categoryHeading[category][0]}
                <br />
                <em>{categoryHeading[category][1]}</em>
              </>
            }
          />
          <motion.div
            className="service-grid"
            variants={list}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.12 }}
          >
            {services.filter(s => s.category === category).map(service => <ServiceCard key={service.slug} service={service} />)}
          </motion.div>
        </section>
      ))}
    </div>
  )
}
