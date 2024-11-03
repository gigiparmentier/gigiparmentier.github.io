import matplotlib.pyplot as plt
import matplotlib.dates as md
import numpy as np
import csv,datetime,dateutil
plt.style.use('ggplot')

open_hours = [
    [],
    #[(7,0),(8,30),(11,30),(13,30),(17,0),(21,0)],
    [(7,0),(21,0)],
    #[(7,0),(8,30),(11,30),(18,0)],
    [(7,0),(18,0)],
    #[(7,0),(8,30),(11,30),(13,30),(16,30),(18,0)],
    [(7,0),(18,0)],
    #[(7,0),(8,30),(11,30),(18,0)],
    [(7,0),(18,0)],
    [(10,30),(20,30)],
    [(8,0),(18,0)]
]

colors = plt.rcParams['axes.prop_cycle'].by_key()['color']

# Load the 'piscine.csv' file
data = []
with open('piscine.csv', 'r') as file:
    reader = csv.reader(file)
    for row in reader:
        data.append(row)

days_of_week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
day = datetime.datetime.today().weekday()
for day in range(1,7):
    print(day)
    fig, ax = plt.subplots(figsize=(15, 7))
    # Iterate over each day of the week
    for pool_line in range(1, 5):
        day_curve = np.zeros((open_hours[day][-1][0]-open_hours[day][0][0])*60)
        for hour in range(open_hours[day][0][0], open_hours[day][-1][0]):
            for minute in range(0, 60):
                if hour*60+minute >= open_hours[day][-1][0]*60 + open_hours[day][-1][1]:
                    break
                if hour*60+minute < open_hours[day][0][0]*60 + open_hours[day][0][1]:
                    continue
                filtered_data = [int(row[4]) for row in data if int(row[0]) == day and int(row[3]) == pool_line and int(row[1]) == hour and int(row[2]) == minute]
                if len(filtered_data) > 0:
                    x = [datetime.datetime(2020,1,1,hour,minute)]*len(filtered_data)
                    ax.plot(x, filtered_data,'o',alpha=0.1,color=colors[pool_line-1])
                mean_percentage = np.mean(filtered_data) if len(filtered_data) > 0 else 0
                i = (hour-open_hours[day][0][0])*60+minute - open_hours[day][0][1]
                day_curve[i] = mean_percentage
                #print(i,day_curve[i])

        size = 30
        sigma = 5
        kernel = np.fromfunction(lambda x: (1/(2*np.pi*sigma**2)) * np.exp(1) ** ((-1*((x-(size-1)/2)**2)/(2*sigma**2))), (size,))
        kernel /= np.sum(kernel)
        day_curve_extended = np.concatenate([np.zeros(size//2),day_curve,np.zeros(size//2)])
        smoothed_day_curve = np.convolve(day_curve_extended,kernel, mode='same')
        smoothed_day_curve = smoothed_day_curve[size//2:-size//2]

        times = [datetime.datetime(2020, 1, 1, open_hours[day][0][0], open_hours[day][0][1]) + datetime.timedelta(minutes=i) for i in range((open_hours[day][-1][0]-open_hours[day][0][0])*60)]
        ax.xaxis.set_major_locator(md.HourLocator(interval=1))
        xfmt = md.DateFormatter('%H:%M')
        ax.xaxis.set_major_formatter(xfmt)
        ax.plot(times, smoothed_day_curve, label=f'Pool line {pool_line}',color=colors[pool_line-1],lw=2)
        ax.set_xlim([datetime.datetime(2020, 1, 1, open_hours[day][0][0], open_hours[day][0][1]), datetime.datetime(2020, 1, 1, open_hours[day][-1][0], open_hours[day][-1][1])])
        ax.set_ylim(0, 102)

    for i,hour in enumerate(open_hours[day][1:-1]):
        ax.axvline(datetime.datetime(2020, 1, 1, hour[0], hour[1]), color='black', lw=1, ls='--')
        if i % 2 == 0:
            width = datetime.datetime(2020,1,1,open_hours[day][i+2][0],open_hours[day][i+2][1]) - datetime.datetime(2020,1,1,hour[0],hour[1])
            ax.add_patch(plt.Rectangle((datetime.datetime(2020, 1, 1, hour[0], hour[1]), 0), width, 100, color='white', alpha=.5))

    ax.set_xlabel('Time ')
    ax.set_ylabel('Occupancy (%)')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['bottom'].set_visible(False)
    ax.spines['left'].set_visible(False)
    ax.set_facecolor('#eeeeee')
    fig.patch.set_alpha(0.0)
    ax.legend()
    # Adjust the spacing between subplots
    plt.grid(color='white')
    # Show the plot
    plt.tight_layout()
    plt.savefig(f'images/pool_{days_of_week[day]}.png',dpi=200)
    plt.close()