# Generated by Django 5.0.6 on 2024-07-07 21:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('predict', '0002_prediction'),
    ]

    operations = [
        migrations.CreateModel(
            name='UsageData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('handset', models.IntegerField(choices=[(0, '2G'), (1, '3G'), (2, '4G')])),
                ('offer_group', models.IntegerField(choices=[(1, 'JawekNet'), (2, 'TRANKIL'), (3, 'HADRANET'), (4, 'PASS ETUDIANT')])),
                ('prediction', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
