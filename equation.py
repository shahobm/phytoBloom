#https://apmonitor.com/pdc/index.php/Main/SolveDifferentialEquations

import numpy as np
from scipy.integrate import odeint
import matplotlib.pyplot as plt

# function that returns dy/dt
def model(y,t):
    k = 0.3
    dydt = -k * y
    return dydt

# initial condition
y0 = 5

# time points
t = np.linspace(0,20)

# solve ODE
y = odeint(model,y0,t)

# plot results
plt.plot(t,y)
plt.xlabel('time')
plt.ylabel('y(t)')
plt.show()

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

p=0 # phytoplankton biomass
d=0 # vertical diffusion
z=0 # water depth
i=0 # incoming solar radiation
a=0 # fraction of incoming light
k=0 # light attenuation coefficient
r=0 # resperation (or loss of phtoplankton biomass with depth)

# model domain
z=0; # from 0-zd (0 - mixing depth which varies over time)

# deeper
z > Zd, a = R = 0 # where respiration iz 0 below mixing depth

# main equation delP/delT change in biomass over time
#solution = d(pD^2/zD^2)+i*a^(-k*z)-r

solution = d*model(p,z)+i*a^(-k*z)-r

print ("del2P/delZ: ", solution)
